import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Observable } from 'rxjs/Observable';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { ModalController } from 'ionic-angular';
import { UserConfiguration } from '../../utils/user-configuration';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaTimelineService } from '../../services/dia-timeline-service';

import { AddFeedingPage } from '../add-feeding/add-feeding';
import { AddGenericPage } from '../add-generic/add-generic';


@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  @ViewChild(FabContainer) fab: FabContainer;
  private timeline$: Observable<any>;
  private userConfig: UserConfiguration;

  constructor(private navCtrl: NavController,
              private configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController) {

    this.userConfig = this.configurationService.getUserConfiguration();
    this.timeline$ = this.timelineService.getTimeline();
  }

  goConfiguration() {
    this.navCtrl.push(ConfigurationPage);
  }

  // refresh timeline
  doRefresh(refresher) {
    this.timelineService.refreshTimeline();
    setTimeout(() => {
      refresher.complete();
    }, 500)
  }

  addGlucose(){
    let data = {
      type: "glucose",
      url: this.timelineService.getGlucoseEndpoint(),
      fields: [
        {
					"display": "Instant",
					"value": null,
					"required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
					"namespace_key": "datetime"
        },
        {
					"display": "Level",
					"value": null,
					"required": true,
					"hint": "",
					"type": "number",
					"regex": "",
					"key": "level",
					"namespace_key": "level"
				}
      ],
      incomplete_elements: [
        {datetime: 0}
      ]
    }
    this.openGenericModal(data);
  }

  addPhysicalActivity(){
    let data = {
      type: "activity",
      url: this.timelineService.getPhysicalActivityEndPoint,
      fields: [],
      incomplete_elements: [
        {}
      ]
    }
    this.openGenericModal(data);
  }

  addInsulinDose(){
    let data = {
      type: "insulin",
      url: this.timelineService.getInsulinDoseEndPoint(),
      fields: [],
      incomplete_elements: [
        {}
      ]
    }
    this.openGenericModal(data);
  }

  addPhysicalTraitChange(){
    let data = {
      type: "trait",
      url: this.timelineService.getPhysicalTraitChangeEndPoint(),
      fields: [],
      incomplete_elements: [
        {}
      ]
    }
    this.openGenericModal(data);
  }

  addFeeding(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddFeedingPage);
    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
  }

  private openGenericModal(data){
    this.fab.close();
    let modal = this.modalCtrl.create(AddGenericPage, {data: data});

    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
  }

  // when a card is clicked must be shown details about it
  cardClicked(instant) {
    
    this.fab.close();
    console.log(JSON.stringify(instant));
  }

}

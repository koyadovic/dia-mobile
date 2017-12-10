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
  private insulinTypes = [];

  constructor(private navCtrl: NavController,
              private configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController) {

    this.userConfig = this.configurationService.getUserConfiguration();
    this.timeline$ = this.timelineService.getTimeline();
    this.timelineService.getInsulinTypes().subscribe((resp) => {
      this.insulinTypes = resp;
    })
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
					"value": 0,
					"required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
					"namespace_key": "datetime"
        },
        {
					"display": "Level",
					"value": 0,
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
      url: this.timelineService.getPhysicalActivityEndPoint(),
      fields: [
        {
					"display": "Instant",
					"value": 0,
					"required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
					"namespace_key": "datetime"
        },
        {
          "display": "Intensity",
          "value": 1,
          "required": true,
          "hint": "",
          "type": "select",
          "regex": "",
          "key": "instensity",
          "options": [
            {
              "display": "Soft",
              "value": 1
            },
            {
              "display": "Medium",
              "value": 2
            },
            {
              "display": "High",
              "value": 3
            },
            {
              "display": "Extreme",
              "value": 4
            },
          ],
          "namespace_key": "instensity"
        },
        {
					"display": "Minutes",
					"value": 0,
					"required": true,
					"hint": "",
					"type": "number",
					"regex": "",
					"key": "minutes",
					"namespace_key": "minutes"
        },

      ],
      incomplete_elements: [
        {datetime: 0}
      ]
    }
    this.openGenericModal(data);
  }

  addInsulinDose(){
    this.timelineService.getInsulinTypes()
    let data = {
      type: "insulin",
      url: this.timelineService.getInsulinDoseEndPoint(),
      fields: [
        {
					"display": "Instant",
					"value": 0,
					"required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
					"namespace_key": "datetime"
        },
        {
          "display": "Type",
          "value": this.insulinTypes.length > 0 ? this.insulinTypes[0].id : null,
          "required": true,
          "hint": "Type",
          "type": "select",
          "regex": "^.*$",
          "key": "insulin_type",
          "options": this.insulinTypes.map((x) => {
            return {display: x.name, value: x.id}
          }),
          "namespace_key": "insulin_type"
        },
        {
					"display": "Dose",
					"value": 0,
					"required": true,
					"hint": "",
					"type": "number",
					"regex": "^.*$",
					"key": "dose",
					"namespace_key": "dose"
        },

      ],
      incomplete_elements: [
        {datetime: 0}
      ]
    }
    this.openGenericModal(data);
  }

  addPhysicalTraitChange(){
    let data = {
      type: "trait",
      url: this.timelineService.getPhysicalTraitChangeEndPoint(),
      fields: [
        {
					"display": "Instant",
					"value": 0,
					"required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
					"namespace_key": "datetime"
        },
        {
          "display": "Type",
          "value": 0,
          "required": true,
          "hint": "Type",
          "type": "select",
          "regex": "^.*$",
          "key": "trait_type",
          "options": [
            { "display": "Birth Date", "value": 1 },
            { "display": "Height (cm)", "value": 2 },
            { "display": "Weight (kg)", "value": 3 },
            { "display": "Neck Perimeter (cm)", "value": 4 },
            { "display": "Abdomen Perimeter (cm)", "value": 5 },
            { "display": "Waist Perimeter (cm)", "value": 6 },
            { "display": "Sex", "value": 7 },
          ],
          "namespace_key": "trait_type"
        },
        {
					"display": "Value",
					"value": null,
					"required": true,
					"hint": "",
					"type": "number",
					"regex": "^.*$",
					"key": "value",
					"namespace_key": "value"
        },
      ],
      incomplete_elements: [
        {datetime: 0}
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

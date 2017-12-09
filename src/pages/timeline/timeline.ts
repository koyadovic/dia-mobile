import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Observable } from 'rxjs/Observable';
import { AddGlucosePage } from '../add-glucose/add-glucose';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { ModalController } from 'ionic-angular';
import { UserConfiguration } from '../../utils/user-configuration';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { AddFeedingPage } from '../add-feeding/add-feeding';
import { AddPhysicalActivityPage } from '../add-physical-activity/add-physical-activity';
import { AddInsulinDosePage } from '../add-insulin-dose/add-insulin-dose';
import { AddTraitChangePage } from '../add-trait-change/add-trait-change';


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

  ionViewDidLoad() {
  }

  addGlucose(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddGlucosePage);
    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
  }

  addPhysicalActivity(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddPhysicalActivityPage);
    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
  }

  addInsulinDose(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddInsulinDosePage);
    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
  }

  addPhysicalTraitChange(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddTraitChangePage);
    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.timelineService.refreshTimeline();
    });
    modal.present();
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

  // when a card is clicked must be shown details about it
  cardClicked(instant) {
    
    this.fab.close();
    console.log(JSON.stringify(instant));
  }

}

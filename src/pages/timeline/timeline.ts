import { Component, ViewChild } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { UserConfiguration } from '../../utils/user-configuration';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaTimelineService } from '../../services/dia-timeline-service';

import { ConfigurationPage } from '../configuration/configuration';
import { AddFeedingPage } from '../add-feeding/add-feeding';
import { AddGenericPage } from '../add-generic/add-generic';
import { DiaAuthService } from '../../services/dia-auth-service';

import * as moment from 'moment-timezone';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Component({
  selector: 'tab-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  @ViewChild(FabContainer) fab: FabContainer;
  private timeline = [];
  private userConfig: UserConfiguration;
  private lastDateShown = "";
  private oldestElementTimestamp = null;
  private now;

  private loggedinSubscription;

  constructor(private navCtrl: NavController,
              private appCtrl: App,
              private configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController,
              private authService: DiaAuthService,
              private translate: TranslateService) {

    this.userConfig = this.configurationService.getUserConfiguration();

    this.loggedinSubscription = this.authService.loggedIn().subscribe((loggedin) => {
      if(loggedin === null) return;

      if(loggedin){
        this.refreshTimeline();

      } else {
        this.userConfig = null;
        if(!!this.loggedinSubscription)
          this.loggedinSubscription.unsubscribe();
      }
    });
  }

  private completeInstants(instants: any[]){
    let processed;

    let lastInstant = null;
    for(let instant of instants) {
      let currentMoment = moment(instant.datetime * 1000);
      // append day of month
      instant.day = currentMoment.format('DD')

      // append distance with the next;
      if (lastInstant !== null) {
        let lastMoment = moment(lastInstant.datetime * 1000);
        lastInstant.minutes_diff = lastMoment.diff(currentMoment) / 1000.0 / 60.0
      }

      // append time passed from now
      instant.passed_from_now = moment(instant.datetime * 1000).fromNow();

      // append moment instance
      instant.moment = moment(instant.datetime * 1000);

      lastInstant = instant;
    }

    // avoiding future errors
    if (!!lastInstant)
      lastInstant.minutes_diff = 0;

    return instants;
  }

  refreshTimeline() {
    this.timelineService.getTimeline().subscribe((instants) => {
      this.now = moment();
      this.timeline = this.completeInstants(instants);
    });
  }

  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }

  // refresh timeline
  doRefresh(refresher) {
    this.timelineService.getTimeline().subscribe((instants) => {
      this.now = moment();
      this.timeline = this.completeInstants(instants);
    });

    setTimeout(() => {
      refresher.complete();
    }, 500)
  }

  addGlucose() {
    forkJoin(
      this.translate.get("New Glucose"),
      this.translate.get("Please, provide the following data."),
    ).subscribe(([glucoseTitle, glucoseInfo]) => {
      let data = {
        "title": glucoseTitle,
        "types": {},
        "elements": [
          {
            "info": glucoseInfo,
            "type": "glucose",
            "fields": {
              "datetime": {
                "default_value": "",
                "disabled": true
              }
            }
          }
        ],
        "actions": [
          {
            "display": "Rechazar",
            "type": "dismiss",
            //"url": "/v1/instants/1/dismiss/", optional
            //"data": {}
          },
          {
            "display": "Añadir",
            "type": "add"
          },
        ]
      };
  
      this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });
  }

  addPhysicalActivity(){
    forkJoin(
      this.translate.get("New Physical Activity"),
      this.translate.get("Introduce intensity and minutes that have spent with the activity."),
    ).subscribe(([activityTitle, activityInfo]) => {
      let data = {
        "title": activityTitle,
        "types": {},
        "elements": [
          {
            "info": activityInfo,
            "type": "activity",
            "fields": {
              "datetime": {
                "default_value": "",
                "disabled": true
              }
            }
          }
        ],
        "actions": [
          {
            "display": "Rechazar",
            "type": "dismiss",
          },
          {
            "display": "Añadir",
            "type": "add"
          },
        ]
      };
  
      this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });
  }

  addInsulinDose(){
    forkJoin(
      this.translate.get("New Insulin Dose"),
      this.translate.get("Introduce type and units of insulin administered."),
    ).subscribe(([doseTitle, doseInfo]) => {
      let data = {
        "title": doseTitle,
        "types": {},
        "elements": [
          {
            "info": doseInfo,
            "type": "insulin",
            "fields": {
              "datetime": {
                "default_value": "",
                "disabled": true
              }
            }
          }
        ],
        "actions": [
          {
            "display": "Rechazar",
            "type": "dismiss",
          },
          {
            "display": "Añadir",
            "type": "add"
          },
        ]
      };
  
      this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });

  }

  addPhysicalTraitChange(){
    forkJoin(
      this.translate.get("New Trait Change"),
      this.translate.get("Select type of trait and complete the value."),
    ).subscribe(([traitTitle, traitInfo]) => {
      let data = {
        "title": traitTitle,
        "types": {},
        "elements": [
          {
            "info": traitInfo,
            "type": "trait",
            "fields": {
              "datetime": {
                "default_value": "",
                "disabled": true
              }
            }
          }
        ],
        "actions": [
          {
            "display": "Rechazar",
            "type": "dismiss",
          },
          {
            "display": "Añadir",
            "type": "add"
          },
        ]
      };
  
      this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });
  }

  addFeeding(){
    this.fab.close();
    let modal = this.modalCtrl.create(AddFeedingPage);
    modal.onDidDismiss((data) => {
      
      if(!!data && data["add"])
        this.refreshTimeline();
        
    });
    modal.present();
  }

  private openGenericModal(data){
    this.fab.close();
    let modal = this.modalCtrl.create(AddGenericPage, {data: data});

    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.refreshTimeline();
    });
    modal.present();
  }

  // when a card is clicked must be shown details about it
  cardClicked(instant) {
    this.fab.close();
    if(instant.content.type === 'action-request') {
      console.log(JSON.stringify(instant));
      this.openGenericModal(instant.content);
    } else {
      console.log(JSON.stringify(instant));
    }
    
  }

  doInfinite(infiniteScroll) {
    if(this.timeline.length === 0 || (!!this.oldestElementTimestamp && this.oldestElementTimestamp === this.timeline[this.timeline.length - 1].datetime)) {
      infiniteScroll.complete();
      return;
    }

    this.timelineService.getTimeline(this.timeline[this.timeline.length - 1].datetime).subscribe(
      (resp) => {
        if(resp.length === 0) {
          this.oldestElementTimestamp = this.timeline[this.timeline.length - 1].datetime;
        }
        this.now = moment();
        let all = this.timeline.concat(resp);
        this.timeline = this.completeInstants(all);
        infiniteScroll.complete();
      }
    );
  }

  dateInfo(index) {
    let instant = this.timeline[index];
    if(index === 0) {
      if(instant.day === this.now.format('DD'))
        return instant.passed_from_now;
      else
        return instant.moment.format('LL');
    } else {

      if (instant.day !== this.timeline[index - 1].day) return instant.moment.format('LL');

      return "";
    }
  }
}

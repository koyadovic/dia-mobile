import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { ModalController } from 'ionic-angular';
import { Events } from 'ionic-angular';
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
import { DiaRestBackendService } from '../../services/dia-rest-backend-service';
import { UserMedicationsPage } from '../user-medications/user-medications';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'tab-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  @ViewChild(FabContainer) fab: FabContainer;

  private timeline = [];
  private futureTimeline = [];
  private showFuture = false;

  public static unattended:number = null;
  private userConfig: UserConfiguration;
  private lastDateShown = "";
  private oldestElementTimestamp = null;
  private now;

  private loggedinSubscription;

  constructor(private navCtrl: NavController,
              private configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController,
              private authService: DiaAuthService,
              private translate: TranslateService,
              public toastCtrl: ToastController,
              private restBackendService: DiaRestBackendService,
              private events: Events) {

    this.userConfig = this.configurationService.getUserConfiguration();

    this.loggedinSubscription = this.authService.loggedIn().subscribe((loggedin) => {
      if(loggedin === null) return;

      this.timelineService.getBackendNotices().subscribe(resp => {
        let timeout = 0;
        for(let notice of resp) {
          
          setTimeout(() => {
            this.toastMessage(notice.message);
          }, timeout);
          timeout += 7000;
        }
      });

      if(loggedin){
        this.refreshTimeline();
      } else {
        this.userConfig = null;
        if(!!this.loggedinSubscription)
          this.loggedinSubscription.unsubscribe();
      }
    });

    // this logic is for other tabs changes that influence the current timeline
    // with this, capture this modifications and when tab changed to this, refresh automatically.
    this.events.subscribe('timeline:with:changes', () => {
      this.refreshTimeline();
    });
    
  }

  diabeticGroup() {
    let userGroups:any[] = this.timelineService.authenticationService.groups;
    return userGroups.indexOf('Diabetics') > -1;
  }

  dietAndExercise() {
    let userGroups:any[] = this.timelineService.authenticationService.groups;
    return userGroups.indexOf('Diet & Exercise') > -1;
  }

  toastMessage(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }


  private completeInstants(instants: any[]){
    let processed;

    let lastInstant = null;

    let futureResultInstants = [];
    let resultInstants = [];

    for(let n=0; n<instants.length; n++) {
      let instant = instants[n];
      let now = new Date().getTime() / 1000;

      if(instant.content.type !== 'action-request' || instant.datetime <= now) {
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
  
        if(instant.datetime > now) {
          futureResultInstants.push(instant);
        } else {
          resultInstants.push(instant);
        }
      }
    }

    /* This is for grouping events in the same day as cards */
    for(let n=0; n<resultInstants.length; n++){
      resultInstants[n].is_start = false;
      resultInstants[n].is_end = false;

      if(n === 0) {
        resultInstants[n].is_start = true;
      }
      if(n === resultInstants.length - 1) {
        resultInstants[n].is_end = true;
      }
      if(n !== 0 && resultInstants[n].day !== resultInstants[n - 1].day) {
        resultInstants[n].is_start = true;
      }
      if(n !== resultInstants.length -1 && resultInstants[n].day !== resultInstants[n + 1].day) {
        resultInstants[n].is_end = true;
      }

    }

    /* the same for future events */
    for(let n=0; n<futureResultInstants.length; n++){
      futureResultInstants[n].is_start = false;
      futureResultInstants[n].is_end = false;

      if(n === 0) {
        futureResultInstants[n].is_start = true;
      }
      if(n === futureResultInstants.length - 1) {
        futureResultInstants[n].is_end = true;
      }
      if(n !== 0 && futureResultInstants[n].day !== futureResultInstants[n - 1].day) {
        futureResultInstants[n].is_start = true;
      }
      if(n !== futureResultInstants.length -1 && futureResultInstants[n].day !== futureResultInstants[n + 1].day) {
        futureResultInstants[n].is_end = true;
      }

    }


    // avoiding future errors
    if (!!lastInstant)
      lastInstant.minutes_diff = 0;

    this.futureTimeline = futureResultInstants;
    this.timeline = resultInstants;
  }

  refreshTimeline() {
    this.showFuture = false;
    this.timelineService.getTimeline().subscribe((response) => {
      let instants = response['instants'];
      TimeLinePage.unattended = response['unattended'] > 0 ? response['unattended'] : null;
      this.now = moment();
      this.completeInstants(instants);
    });
  }

  // refresh timeline
  doRefresh(refresher) {
    this.timelineService.getTimeline().subscribe((response) => {
      this.showFuture = false;
      let instants = response['instants'];
      TimeLinePage.unattended = response['unattended'] > 0 ? response['unattended'] : null;
      this.now = moment();
      this.completeInstants(instants);
      refresher.complete();
    });
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
  
      // this.timelineService.completeAllGenericTypes(data);
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
  
      // this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });
  }

  addMedicationTake(){
    forkJoin(
      this.translate.get("New Medication Take"),
      this.translate.get("Introduce what medication and units administered."),
    ).subscribe(([medicationTitle, unitsInfo]) => {
      let data = {
        "title": medicationTitle,
        "types": {},
        "elements": [
          {
            "info": unitsInfo,
            "type": "medication-take",
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
  
      // this.timelineService.completeAllGenericTypes(data);
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
  
      // this.timelineService.completeAllGenericTypes(data);
      this.openGenericModal(data);
    });
  }

  addFeeding(data){
    this.fab.close();
    let modal = this.modalCtrl.create(AddFeedingPage, {data: data});

    modal.onDidDismiss((data) => {
      if(!!data && data["add"])
        this.refreshTimeline();
    });
    modal.present();
  }

  private openGenericModal(data){
    this.fab.close();

    let modal = this.modalCtrl.create(AddGenericPage, {data: data});

    modal.onDidDismiss((requests) => {
      if(!!requests && requests["requests"] && requests["requests"].length > 0) {
        let rs = requests["requests"].map(x => this.restBackendService.genericPost(x.url, x.data));
        forkJoin(...rs).subscribe(
          (resp) => {
            this.refreshTimeline();
          }
        );
      }
    });
    modal.present();
  }

  // when a card is clicked must be shown details about it
  cardClicked(instant) {
    this.fab.close();
    if(instant.content.type === 'action-request' && instant.content.status === 0) { // only if unattended
      if (instant.content.elements[0].type === 'feeding') {
        this.addFeeding(instant.content);
      } else {
        this.openGenericModal(instant.content);
      }
    }
  }

  doInfinite(infiniteScroll) {
    if(this.timeline.length === 0 || (!!this.oldestElementTimestamp && this.oldestElementTimestamp === this.timeline[this.timeline.length - 1].datetime)) {
      infiniteScroll.complete();
      return;
    }

    this.timelineService.getTimeline(this.timeline[this.timeline.length - 1].datetime).subscribe(
      (resp) => {
        if(resp['instants'].length === 0) {
          this.oldestElementTimestamp = this.timeline[this.timeline.length - 1].datetime;
        }
        this.now = moment();
        let all = this.futureTimeline.concat(this.timeline.concat(resp['instants']))
        this.completeInstants(all);
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

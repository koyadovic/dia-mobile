import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  @ViewChild(FabContainer) fab: FabContainer;
  private timeline = [];
  private userConfig: UserConfiguration;
  private insulinTypes = [];
  private lastDateShown = "";
  private oldestElementTimestamp = null;
  private now;

  constructor(private navCtrl: NavController,
              private configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController,
              private authService: DiaAuthService,
              private translate: TranslateService) {

    this.userConfig = this.configurationService.getUserConfiguration();

    this.authService.loggedIn().subscribe((loggedin) => {
      if(!loggedin) return;

      this.refreshTimeline();

      this.timelineService.getInsulinTypes().subscribe((resp) => {
        this.insulinTypes = resp;
      });
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
    this.navCtrl.push(ConfigurationPage);
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

  addGlucose(){
    forkJoin(
      this.translate.get("Instant"),
      this.translate.get("Level"),
      this.translate.get("Please, provide the following data."),
    ).subscribe(([instant, level, glucoseName]) => {
      let data = {
        type: "glucose",
        url: this.timelineService.getGlucoseEndpoint(),
        fields: [
          {
            "display": instant,
            "value": 0,
            "required": false,
            "hint": "",
            "type": "date",
            "regex": "",
            "key": "datetime",
            "namespace_key": "datetime"
          },
          {
            "display": level,
            "value": null,
            "required": true,
            "hint": "mg/dL",
            "type": "number",
            "regex": "",
            "key": "level",
            "namespace_key": "level"
          }
        ],
        elements: [
          {
            "name": glucoseName,
            "datetime": null
          }
        ]
      }
      this.openGenericModal(data);
    });
  }

  addPhysicalActivity(){
    forkJoin(
      this.translate.get("Instant"),
      this.translate.get("Intensity"),
      this.translate.get("Minutes"),
      this.translate.get("Number of minutes"),
      this.translate.get("Introduce intensity and minutes that have spent with the activity."),
      this.translate.get("Soft"),
      this.translate.get("Medium"),
      this.translate.get("High"),
      this.translate.get("Extreme"),
    ).subscribe(([instant, intensity, minutes, numberMinutes, activityName,
    soft, medium, high, extreme]) => {
      let data = {
        type: "activity",
        url: this.timelineService.getPhysicalActivityEndPoint(),
        fields: [
          {
            "display": instant,
            "value": 0,
            "required": false,
            "hint": "",
            "type": "date",
            "regex": "",
            "key": "datetime",
            "namespace_key": "datetime"
          },
          {
            "display": intensity,
            "value": 1,
            "required": true,
            "hint": "",
            "type": "select",
            "regex": "",
            "key": "intensity",
            "options": [
              { "display": soft, "value": 1 },
              { "display": medium, "value": 2 },
              { "display": high, "value": 3 },
              { "display": extreme, "value": 4 },
            ],
            "namespace_key": "intensity"
          },
          {
            "display": minutes,
            "value": 0,
            "required": true,
            "hint": numberMinutes,
            "type": "number",
            "regex": "",
            "key": "minutes",
            "namespace_key": "minutes"
          },
  
        ],
        elements: [
          {
            "name": activityName,
            "datetime": null,
            "minutes" : null
          }
        ]
      }
      this.openGenericModal(data);
  
    });
  }

  addInsulinDose(){
    forkJoin(
      this.translate.get("Instant"),
      this.translate.get("Type"),
      this.translate.get("Dose"),
      this.translate.get("Units of insulin"),
      this.translate.get("Introduce type and units of insulin administered."),
    ).subscribe(([instant, type, dose, unitsOfDose, doseName]) => {
      let data = {
        type: "insulin",
        url: this.timelineService.getInsulinDoseEndPoint(),
        fields: [
          {
            "display": instant,
            "value": 0,
            "required": false,
            "hint": "",
            "type": "date",
            "regex": "",
            "key": "datetime",
            "namespace_key": "datetime"
          },
          {
            "display": type,
            "value": this.insulinTypes.length > 0 ? this.insulinTypes[0].id : null,
            "required": true,
            "hint": type,
            "type": "select",
            "regex": "^.*$",
            "key": "insulin_type",
            "options": this.insulinTypes.map((x) => {
              return {display: x.name, value: x.id}
            }),
            "namespace_key": "insulin_type"
          },
          {
            "display": dose,
            "value": null,
            "required": true,
            "hint": unitsOfDose,
            "type": "number",
            "regex": "^.*$",
            "key": "dose",
            "namespace_key": "dose"
          }
        ],
        elements: [
          {
            "name": doseName,
            "datetime": null,
            "dose": null
          },
        ],
      }
      this.openGenericModal(data);
  
    });

  }

  addPhysicalTraitChange(){
    forkJoin(
      this.translate.get("Instant"),
      this.translate.get("Type"),
      this.translate.get("Select date"),
      this.translate.get("Date of birth"),
      this.translate.get("Sex"),
      this.translate.get("Value"),
      this.translate.get("Introduce a value"),
      this.translate.get("Select type of trait and complete the value."),

      this.translate.get("Birth Date"),
      this.translate.get("Height (cm)"),
      this.translate.get("Weight (kg)"),
      this.translate.get("Neck Perimeter (cm)"),
      this.translate.get("Abdomen Perimeter (cm)"),
      this.translate.get("Waist Perimeter (cm)"),

      this.translate.get("Male"),
      this.translate.get("Female"),
    ).subscribe(([instant, type, selectDate, dateOfBirth, sex,
    value, introduceAValue, traitName, birthDate, height, weight,
    neck, abdomen, waist, male, female]) => {
      let data = {
        type: "trait",
        url: this.timelineService.getPhysicalTraitChangeEndPoint(),
        fields: [
          {
            "display": instant,
            "value": 0,
            "conditional": {
              "$or": [
                { "trait_type": 2 },
                { "trait_type": 3 },
                { "trait_type": 4 },
                { "trait_type": 5 },
                { "trait_type": 6 },
              ]
            },
            "required": false,
            "hint": "",
            "type": "date",
            "regex": "",
            "key": "datetime",
            "namespace_key": "datetime",
          },
          {
            "display": type,
            "value": 1,
            "conditional": {},
            "required": true,
            "hint": type,
            "type": "select",
            "regex": "^.*$",
            "key": "trait_type",
            "options": [
              { "display": birthDate, "value": 1 },
              { "display": height, "value": 2 },
              { "display": weight, "value": 3 },
              { "display": neck, "value": 4 },
              { "display": abdomen, "value": 5 },
              { "display": waist, "value": 6 },
              { "display": sex, "value": 7 },
            ],
            "namespace_key": "trait_type"
          },
          {
            "display": selectDate,
            "value": 0,
            "conditional": {
              "$or": [
                { "trait_type": 1 },
              ]
            },
            "required": true,
            "hint": dateOfBirth,
            "type": "date",
            "regex": "^.*$",
            "key": "value",
            "namespace_key": "value"
          },
          {
            "display": sex,
            "value": 0,
            "conditional": {
              "$or": [
                { "trait_type": 7 },
              ]
            },
            "required": true,
            "hint": "",
            "type": "select",
            "regex": "^.*$",
            "key": "value",
            "namespace_key": "value",
            "options": [
              {"display": male, "value": 0},
              {"display": female, "value": 1},
            ]
          },
          {
            "display": value,
            "value": 0,
            "conditional": {
              "$or": [
                { "trait_type": 2 },
                { "trait_type": 3 },
                { "trait_type": 4 },
                { "trait_type": 5 },
                { "trait_type": 6 },
              ]
            },
            "required": true,
            "hint": introduceAValue,
            "type": "number",
            "regex": "^.*$",
            "key": "value",
            "namespace_key": "value"
          },
        ],
        elements: [
          {
            "name": traitName,
            "datetime": null,
            "trait_type": 1,
            "value": null
          },
        ],
      }
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
    console.log(JSON.stringify(instant));
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
        return "Today";
      else
        return instant.moment.format('LL');
    } else {

      if (instant.day !== this.timeline[index - 1].day) return instant.moment.format('LL');

      return "";
    }
  }
}

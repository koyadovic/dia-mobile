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
import { DiaAuthService } from '../../services/dia-auth-service';

import * as moment from 'moment-timezone';


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
              private authService: DiaAuthService) {

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
            { "display": "Soft", "value": 1 },
            { "display": "Medium", "value": 2 },
            { "display": "High", "value": 3 },
            { "display": "Extreme", "value": 4 },
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
          "value": null,
          "required": true,
          "hint": "",
          "type": "number",
          "regex": "^.*$",
          "key": "dose",
          "namespace_key": "dose"
        }
      ],
      conditional_fields: [
        {
          key: "dose",
          comparator: ">",
          value: "13",
          field: "sex"
        }
      ],
      elements: [
        {
          name: "Insulina comidas",
          fixed_fields: [
            { key: "datetime", value: 0 },
          ],
          fields: [
            { key: "dose" },
          ],
        }
      ],
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
          "conditional": {},
          "required": false,
					"hint": "",
					"type": "date",
					"regex": "",
					"key": "datetime",
          "namespace_key": "datetime",
        },
        {
          "display": "Type",
          "value": 1,
          "conditional": {},
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
					"display": "Select date",
          "value": null,
          "conditional": {
            "$or": [
              { "trait_type": 1 },
            ]
          },
					"required": true,
					"hint": "",
					"type": "date",
					"regex": "^.*$",
					"key": "value",
					"namespace_key": "value"
        },
        {
					"display": "Sex",
          "value": null,
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
            {"display": "Male", "value": 0},
            {"display": "Female", "value": 1},
          ]
        },
        {
					"display": "Value",
          "value": null,
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
					"hint": "",
					"type": "number",
					"regex": "^.*$",
					"key": "value",
					"namespace_key": "value"
        },
      ],
      elements: [
        {
          "name": "Lalala",
          "datetime": null,
          "trait_type": 3,
          "value": 0
        },
      ],
    }
    this.openGenericModal(data);
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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Planning, PLANNING_TYPES } from '../../models/plannings-model';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { AddGenericPage } from '../add-generic/add-generic';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { DiaPlanningsService } from '../../services/dia-plannings-service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-plannings-editor',
  templateUrl: 'plannings-editor.html',
})
export class PlanningsEditorPage {
  @Input() planning: Planning;

  datetimeTime = "";

  dataPreserved = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private translate: TranslateService,
              private timelineService: DiaTimelineService,
              private viewCtrl: ViewController,
              private planningsService: DiaPlanningsService,
              public toastCtrl: ToastController) {

    // get data
    this.planning = this.navParams.get("planning");
    if(this.planning === null) this.createPlanning();

    this.dataPreserved[PLANNING_TYPES.PHYSICAL_ACTIVITY] = {};
    this.dataPreserved[PLANNING_TYPES.MEDICATION_TAKE] = {};
    this.dataPreserved[this.planning.type] = this.planning.data;

    // this sets the ion-datetime to current time.
    let local_hour = this.planning.local_hour > 9 ? `${this.planning.local_hour}` : `0${this.planning.local_hour}`;
    let local_minute = this.planning.local_minute > 9 ? `${this.planning.local_minute}` : `0${this.planning.local_minute}`;
    this.datetimeTime = `${local_hour}:${local_minute}`;
  }

  definePlanning() {
    if(this.planning.type == PLANNING_TYPES.PHYSICAL_ACTIVITY) {
      this.getPhysicalActivityStructure().subscribe((data) => {
        this.openGenericModal(data);
      });
    } else if(this.planning.type == PLANNING_TYPES.MEDICATION_TAKE) {
      this.getMedicationTakeStructure().subscribe((data) => {
        this.openGenericModal(data);
      });
    }
  }

  diabeticGroup() {
    let userGroups:any[] = this.timelineService.authenticationService.groups;
    return userGroups.indexOf('Diabetics') > -1;
  }

  dietAndExercise() {
    let userGroups:any[] = this.timelineService.authenticationService.groups;
    return userGroups.indexOf('Diet & Exercise') > -1;
  }

  private openGenericModal(data){
    for(let key in this.dataPreserved[this.planning.type]) {
      // this is to preserve the configuration made in the generic dialog.
      data['elements'][0]['fields'][key] = {};
      data['elements'][0]['fields'][key]['default_value'] = this.dataPreserved[this.planning.type][key];
      data['elements'][0]['fields'][key]['disabled'] = false;

      data[key] = this.dataPreserved[this.planning.type][key];
    }
    let modal = this.modalCtrl.create(AddGenericPage, {data: data});

    modal.onDidDismiss((requests) => {
      if(!!requests && requests["requests"] && requests["requests"].length > 0) {
        let rs = requests['requests'];
        this.planning.data = rs[0].data;
        delete this.planning.data['datetime'];
        this.dataPreserved[this.planning.type] = this.planning.data;
      }
    });
    modal.present();
  }

  emptyDict(dict:object) {
    return Object.keys(dict).length === 0;
  }

  updateTypeData() {
    this.planning.data = this.dataPreserved[this.planning.type];
  }

  save() {
    if(this.planning.id === null) {
      this.planningsService.savePlanning(this.planning).subscribe(
        (resp) => {
          // mensaje, todo fue guay
          this.toast('Everything was good. Planning saved.')
          this.viewCtrl.dismiss({"refresh": true});
        },
        (err) => {
          this.toast(`ERROR: ${err}`);
        }
      );
    } else {
      this.planningsService.modifyPlanning(this.planning.id, this.planning).subscribe(
        (resp) => {
          // mensaje, todo fue guay
          this.toast('Everything was good. Planning saved.')
          this.viewCtrl.dismiss({"refresh": true});
        },
        (err) => {
          this.toast(`ERROR: ${err}`);
        }
      );
    }
    
  }

  createPlanning() {
    this.planning = {
      id: null, name: '',
      type: PLANNING_TYPES.PHYSICAL_ACTIVITY,
      data: {},
      enabled: false,
      mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false,
      local_hour: 0, local_minute: 0,
    }
  }

  getPhysicalActivityStructure(): Observable<any>{
    return Observable.create((observer) => {
      forkJoin(
        this.translate.get("New Physical Activity"),
        this.translate.get("Introduce intensity and minutes that have spent with the activity."),
      ).subscribe(([activityTitle, activityInfo]) => {
        let data = {
          "title": activityTitle,
          "types": {},
          "elements": [
            { "info": activityInfo, "type": "activity", "fields": { "datetime": { "default_value": "", "disabled": true }}}
          ],
          "actions": [
            {"display": "Rechazar", "type": "dismiss", },
            {"display": "Añadir", "type": "add"},
          ]
        };
        this.timelineService.completeAllGenericTypes(data);
        observer.next(data);
        observer.complete();
      });
    });
  }

  getMedicationTakeStructure(){
    return Observable.create((observer) => {
      forkJoin(
        this.translate.get("New Medication Take"),
        this.translate.get("Introduce what medication and units administered."),
      ).subscribe(([medicationTitle, amountInfo]) => {
        let data = {
          "title": medicationTitle,
          "types": {},
          "elements": [
            {"info": amountInfo, "type": "medication-take", "fields": {"datetime": {"default_value": "", "disabled": true}}}
          ],
          "actions": [
            {"display": "Rechazar", "type": "dismiss",},
            {"display": "Añadir", "type": "add"},
          ]
        };
        this.timelineService.completeAllGenericTypes(data);
        observer.next(data);
        observer.complete();
      });
    });
  }

  timeChanged() {
    let parts = this.datetimeTime.split(':');
    this.planning.local_hour = parseInt(parts[0]);
    this.planning.local_minute = parseInt(parts[1]);
  }

  toast(message:string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {});
    toast.present();
  }
}

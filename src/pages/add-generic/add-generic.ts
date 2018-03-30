import { Component, Input } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { DiaRestBackendService } from '../../services/dia-rest-backend-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { UserMedicationsPage } from '../user-medications/user-medications';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { DiaAuthService } from '../../services/dia-auth-service';

@Component({
  selector: 'page-add-generic',
  templateUrl: 'add-generic.html',
})
export class AddGenericPage {
  @Input() dateFormat;
  @Input() timezone;

  private originalData;
  private data;

  complete_elements: object[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              private modalCtrl: ModalController,
              public events: Events,
              private restBackendService: DiaRestBackendService,
              public loadingCtrl: LoadingController,
              private authService: DiaAuthService) {

    // get data
    this.originalData = this.navParams.get("data");

    // this is useful when we want to hide some key because it has no sense.
    let fields_to_hide = this.navParams.get("hide_fields");
    if (fields_to_hide === undefined){
      fields_to_hide = [];
    }

    this.data = JSON.parse(JSON.stringify(this.originalData));
    this.timelineService.completeAllGenericTypes(this.data);

    // this is to remove duplicated date fields
    let date_field_values = [];

    this.data["elements"].forEach((element) => {

      let computed_fields = JSON.parse(JSON.stringify(this.data["types"][element["type"]]["fields"]));

      for(let computed_field of computed_fields) {
        for(let field in element["fields"]) {
  
          if (field === computed_field["key"]) {
            computed_field["value"] = element["fields"][field]["default_value"];
            computed_field["disabled"] = element["fields"][field]["disabled"];
          }
          
          // with this code, if field is disabled and is a selectable field, is silly show all alternatives
          // only show the selected option.
          if (computed_field["disabled"] && (computed_field["type"] == 'radio' || computed_field["type"] == 'select')) {
            computed_field["options"] = computed_field["options"].filter(option => option["value"] == computed_field["value"] )
          }

        }
      }

      // with this we try to remove duplicated dates when it's recommended something from the backend
      for(let computed_field of computed_fields) {
        if (computed_field["type"] === 'date') {
          if (date_field_values.indexOf(computed_field["value"]) < 0) {
            date_field_values.push(computed_field["value"])
            computed_field["show"] = true;
          } else {
            computed_field["show"] = false;
          }
        }

        if(fields_to_hide.indexOf(computed_field["key"]) > -1) {
          computed_field["show"] = false;
        }
      }

      element["computed_fields"] = JSON.parse(JSON.stringify(computed_fields));
    });
  }

  haveChanges(event, element) {
    if(event.value === "medication_edition_request" && event.namespace_key === 'medication_edition_request') {
      this.openMedications();
    } else {
      element[event.namespace_key] = event.value;
    }
  }

  isConditionalTrue(element, field){
    let conditional = field.conditional;
    if(!conditional || Object.keys(conditional).length === 0){
      return true;
    }
    let evaluate = null;
    for(let key in conditional) {
      for(let sentence of conditional[key]){

        for (let sentenceKey in sentence) {
          
          let elementValue;
          for(let rawField of element['computed_fields']) {
            if(rawField['key'] === sentenceKey) {
              elementValue = rawField['value'];
            }
          }

          if (!elementValue) {
            return false;
          }
          let conditionalValue = sentence[sentenceKey];
          if(key === "$or"){

            if(evaluate === null) {
              evaluate = elementValue === conditionalValue;
            } else {
              evaluate = evaluate || (elementValue === conditionalValue);
            }

            if (evaluate) {
              return true;
            }

          } else if(key === "$and"){
            if(evaluate === null) {
              evaluate = elementValue === conditionalValue;
            } else {
              evaluate = evaluate && (elementValue === conditionalValue);
            }

            if(!evaluate) {
              return false;
            }
          }
        }
      }
    }
    return evaluate;
  }

  doAction(action) {
    // si hay algún error en los requests, los request de los actions no deberían ser realizados.

    let requests = [];

    switch(action['type']) {
      case 'dismiss':
      break;

      case 'add':
      for(let element of this.data['elements']) {
        let data = {}
        let url = this.data['types'][element['type']]['url'];
        for(let field of element['computed_fields']) {
          if (field['type'] === 'date') {
            data[field['key']] = new Date(field['value']).valueOf() / 1000.;
          } else if (field['key'] !== 'medication_edition_request') {
            data[field['key']] = field['value'];
          }
        }
        requests.push({url: url, data: data});
      }
      break;
    }

    if('url' in action) {
      let url = action['url'];
      let data = {};
      if ('data' in action) {
        data = action['data'];
      }
      requests.push({url: url, data: data})
    }

    if (requests.length === 0) {
      this.viewCtrl.dismiss();
    } else {
      this.viewCtrl.dismiss({"requests": requests});
    }
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

  isValid(){
    for(let element of this.data.elements) {
      for(let field of element.computed_fields) {
        if (this.hasProp(field, 'valid') && !field.valid){
          return false;
        }
      }
    }
    return true;
  }

  openMedications() {
    let modal = this.modalCtrl.create(UserMedicationsPage);
    modal.onDidDismiss((data) => {
      if (UserMedicationsPage.hadChanges) {

        // this is to maintain users busy
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        this.timelineService.refreshElementFields();

        this.events.publish('medications:medications-change');

        setTimeout(
          () => {
            // refresh the original data
            this.data = JSON.parse(JSON.stringify(this.originalData));
            this.timelineService.completeAllGenericTypes(this.data);
            this.data["elements"].forEach((element) => {
            let computed_fields = Object.assign([], this.data["types"][element["type"]]["fields"]);
      
            for(let computed_field of computed_fields) {
              for(let field in element["fields"]) {
      
                if (field === computed_field["key"]) {
                  computed_field["value"] = element["fields"][field]["default_value"];
                  computed_field["disabled"] = element["fields"][field]["disabled"];
                }
              }
            }
              element["computed_fields"] = computed_fields;
            });

            loading.dismiss();

          }
        ,1000);
      }
    });
    modal.present();
  }
}

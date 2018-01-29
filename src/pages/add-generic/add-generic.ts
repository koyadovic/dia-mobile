import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiaRestBackendService } from '../../services/dia-rest-backend-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@Component({
  selector: 'page-add-generic',
  templateUrl: 'add-generic.html',
})
export class AddGenericPage {
  @Input() dateFormat;
  @Input() timezone;

  private data;

  complete_elements: object[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private restBackendService: DiaRestBackendService) {

    // get data
    this.data = this.navParams.get("data");

    this.data["elements"].forEach((element) => {
      let computed_fields = Object.assign([], this.data["types"][element["type"]]["fields"]);

      for(let computed_field of computed_fields) {
        for(let field in element["fields"]) {

          if (field === computed_field["key"]) {
            computed_field["value"] = element["fields"][field]["default_value"];
            computed_field["disabled"] = element["fields"][field]["disabled"];
          }
        }
        element["computed_fields"] = computed_fields;
      }
    });
  }

  haveChanges(event, element) { 
    element[event.namespace_key] = event.value;
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
          } else {
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
        if((this.hasProp(field, 'disabled') && field['disabled'] === false) || !this.hasProp(field, 'disabled')) {
          if (!this.hasProp(field, 'valid') || (this.hasProp(field, 'valid') && !field.valid)){
            return false;
          }
        }
      }
    }
    return true;
  }
}

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

  private data: {
    type: "feeding" | "glucose" | "trait" | "activity" | "insulin",
    url: string,
    fields: object[],
    elements: object[]
  };

  complete_elements: object[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private restBackendService: DiaRestBackendService) {

    // get data
    this.data = this.navParams.get("data");

    // clone the original array
    this.complete_elements = this.data.elements.map(x => Object.assign({}, x));

    this.complete_elements.forEach((element) => {
      element["fields"] = this.data.fields.map(x => Object.assign({}, x));
      for(let field of element["fields"]) {
        if(field.key in element) {
          field.value = element[field.key];
        }
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

          let elementValue = element[sentenceKey];

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

  save(){
    let url = this.data.url;
    let requests = [];

    // TODO maybe we need to include logic checking if complete elements are already completed.
    for(let elem of this.complete_elements) {
      delete elem["fields"];
      requests.push(this.restBackendService.genericPost(url, elem));
    }

    forkJoin(...requests).subscribe(
      (resp) => {
        this.viewCtrl.dismiss({"add": true});
      },
      (err) => {
        console.log(err);
      },
    );
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }
}

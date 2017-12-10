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
  private data: {
    type: "feeding" | "glucose" | "trait" | "activity" | "insulin",
    url: string,
    fields: object[],
    incomplete_elements: object[]
  };

  complete_elements: object[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private restBackendService: DiaRestBackendService) {

    // get data
    this.data = this.navParams.get("data");

    // clone the original array
    this.complete_elements = this.data.incomplete_elements.map(x => Object.assign({}, x));

    for(let field of this.data.fields) {
      for(let element of this.complete_elements) {
        if(!(field["key"] in element)) {
          element[field["key"]] = field["value"]
        }
      }
    }
  }

  save(){
    let url = this.data.url;
    let requests = [];

    // TODO maybe we need to include logic checking if complete elements are already completed.
    for(let elem of this.complete_elements) {
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

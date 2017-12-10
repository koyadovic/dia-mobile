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
  @Input() data: {
    type: "feeding" | "glucose" | "trait" | "activity" | "insulin",
    url: string,
    fields: object[],
    incomplete_elements: object[]
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private restBackendService: DiaRestBackendService) {

  }

  save(){
    let url = this.data.url;
    let requests = [];

    for(let elem of this.data.incomplete_elements) {
      requests.push(this.restBackendService.genericPost(url, elem));
    }

    forkJoin(...requests).subscribe(
      (resp) => {
        this.viewCtrl.dismiss({"add": true});
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

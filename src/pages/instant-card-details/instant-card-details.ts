import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-instant-card-details',
  templateUrl: 'instant-card-details.html',
})
export class InstantCardDetailsPage {
  instantCard;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {

    this.instantCard = this.navParams.get("instantCard");
    console.log(this.instantCard);
  }


  closeWithRefresh() {
    this.viewCtrl.dismiss({"refresh": true});
  }

  closeWithoutRefresh() {
    this.viewCtrl.dismiss({"refresh": false});
  }
}

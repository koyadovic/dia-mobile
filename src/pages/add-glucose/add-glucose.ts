import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the AddGlucosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-glucose',
  templateUrl: 'add-glucose.html',
})
export class AddGlucosePage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGlucosePage');
  }

}

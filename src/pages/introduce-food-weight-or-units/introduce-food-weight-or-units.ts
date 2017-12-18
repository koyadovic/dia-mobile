import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'introduce-food-weight-or-units',
  templateUrl: 'introduce-food-weight-or-units.html',
})
export class IntroduceFoodWeightOrUnitsPage {

  private food;
  private units:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,) {

    this.food = this.navParams.get("food");
    this.food.weight = null;
    this.food.units = null;
    this.units = this.food.weight_per_unit > 0;
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.viewCtrl.dismiss({ food: this.food });
  }

  valid() {
    return this.food.weight > 0.0 || this.food.units > 0.0;
  }

}

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
    this.food.g_or_ml_selected = null;
    this.food.units_selected = null;
    this.units = this.food.g_or_ml_per_unit > 0;
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
    return this.food.g_or_ml_selected > 0.0 || this.food.units_selected > 0.0;
  }

}

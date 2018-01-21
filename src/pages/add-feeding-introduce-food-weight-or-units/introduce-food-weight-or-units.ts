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

  kcal(){
    let f = this.food;
    let weight = this.weight();
    return this.round((+f.carb_factor * weight * 4.) + (+f.protein_factor * weight * 4.) + (+f.fat_factor * weight * 9.) + (+f.alcohol_factor * weight * 7.));
  }

  valid() {
    return this.food.g_or_ml_selected > 0.0 || this.food.units_selected > 0.0;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  weight() {
    let f = this.food;
    let weight;
    if(this.units) {
      if(f.units_selected === '') {
        weight = 0.0;
      } else {
        weight = +f.units_selected * f.g_or_ml_per_unit;
      }
    } else {
      if(f.g_or_ml_selected === '') {
        weight = 0.0;
      } else {
        weight = +f.g_or_ml_selected;
      }
      
    }
    return weight;
  }

}

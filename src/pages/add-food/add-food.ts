import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-add-food',
  templateUrl: 'add-food.html',
})
export class AddFoodPage {
  
  private food = {
    name: "",
    manufacturer: "",
    g_or_ml: "100",
    g_or_ml_per_unit: null,
    carb_g: null,
    protein_g: null,
    fat_g: null,
    fiber_g: null,
    alcohol_g: null
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {}

  kcal(){
    let f = this.food;
    return (+f.carb_g * 4.) + (+f.protein_g * 4.) + (+f.fat_g * 9.) + (+f.alcohol_g * 7.);
  }

  ionViewDidLoad() {
  }

  valid(){
    let f = this.food;
    if(f.name === "" || f.manufacturer === "") return false;
    if(+f.g_or_ml < +f.carb_g + +f.protein_g + +f.fat_g + +f.fiber_g + +f.alcohol_g) return false;
    if(f.carb_g === null || f.protein_g === null || f.fat_g === null) return false;
    return true;
  }

  save() {
    this.timelineService.saveFood(this.food).subscribe(
      (food) => {
        this.viewCtrl.dismiss();
      }
    )
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}

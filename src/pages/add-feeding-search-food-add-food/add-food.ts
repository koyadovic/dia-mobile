import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { DiaFood } from '../../models/food-model';


@Component({
  selector: 'page-add-food',
  templateUrl: 'add-food.html',
})
export class AddFoodPage {
  
  private resultFood = {
    id: 0,
    name: "",
    manufacturer: "",
    g_or_ml_per_unit: 0,
    carb_factor: 0,
    protein_factor: 0,
    fat_factor: 0,
    fiber_factor: 0,
    alcohol_factor: 0
  }

  private food = {
    name: "",
    manufacturer: "",
    g_or_ml: null,
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

  valid(){
    let f = this.resultFood;
    if(f.name === "" || f.manufacturer === "") return false;
    if(f.carb_factor + f.protein_factor + f.fat_factor + f.fiber_factor + f.alcohol_factor > 1.0) return false;
    if(f.carb_factor === null || f.protein_factor === null || f.fat_factor === null) return false;
    if(f.carb_factor === 0.0 || f.protein_factor === 0.0 || f.fat_factor === 0.0) return false;
    return true;
  }

  save() {
    this.timelineService.saveFood(<DiaFood>this.resultFood).subscribe(
      (food) => {
        this.viewCtrl.dismiss({food: food});
      }
    )
  }
  
  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  updateResult() {
    this.resultFood.name = this.food.name;
    this.resultFood.manufacturer = this.food.manufacturer;
    this.resultFood.g_or_ml_per_unit = this.food.g_or_ml_per_unit !== null ? +this.food.g_or_ml_per_unit : 0.0;
    if (this.food.g_or_ml !== null) {
      this.resultFood.carb_factor = this.food.carb_g !== null ? +this.food.carb_g / +this.food.g_or_ml : 0.0;
      this.resultFood.protein_factor = this.food.protein_g !== null ? +this.food.protein_g / +this.food.g_or_ml : 0.0;
      this.resultFood.fat_factor = this.food.fat_g !== null ? +this.food.fat_g / +this.food.g_or_ml : 0.0;
      this.resultFood.fiber_factor = this.food.fiber_g !== null ? +this.food.fiber_g / +this.food.g_or_ml : 0.0;
      this.resultFood.alcohol_factor = this.food.alcohol_g !== null ? +this.food.alcohol_g / +this.food.g_or_ml : 0.0;
    }
  }
}

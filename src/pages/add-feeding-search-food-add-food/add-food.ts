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
  
  private food = {
    id: null,
    name: "",
    manufacturer: "",
    g_or_ml_per_unit: null,
    carb_factor: null,
    protein_factor: null,
    fat_factor: null,
    fiber_factor: null,
    alcohol_factor: null
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {}


  ionViewDidLoad() {
  }

  valid(){
    let f = this.food;
    if(f.name === "" || f.manufacturer === "") return false;
    if(+f.carb_factor + +f.protein_factor + +f.fat_factor + +f.fiber_factor + +f.alcohol_factor > 1.0) return false;
    if(f.carb_factor === null || f.protein_factor === null || f.fat_factor === null) return false;
    return true;
  }

  save() {
    this.timelineService.saveFood(<DiaFood>this.food).subscribe(
      (food) => {
        this.viewCtrl.dismiss({food: this.food});
      }
    )
  }
  
  dismiss() {
    this.viewCtrl.dismiss(null);
  }
}

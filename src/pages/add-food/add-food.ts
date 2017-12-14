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
    total_gr_ml: "100",
    weight_per_unit: null,
    carb_gr: null,
    protein_gr: null,
    fat_gr: null,
    fiber_gr: null,
    alcohol_gr: null
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {}

  kcal(){
    let f = this.food;
    return (+f.carb_gr * 4.) + (+f.protein_gr * 4.) + (+f.fat_gr * 9.) + (+f.alcohol_gr * 7.);
  }

  ionViewDidLoad() {
  }

  valid(){
    let f = this.food;
    if(f.name === "" || f.manufacturer === "") return false;
    if(+f.total_gr_ml < +f.carb_gr + +f.protein_gr + +f.fat_gr + +f.fiber_gr + +f.alcohol_gr) return false;
    if(f.carb_gr === null || f.protein_gr === null || f.fat_gr === null) return false;
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

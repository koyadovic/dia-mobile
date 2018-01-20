import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SearchFoodPage } from '../../pages/search-food/search-food';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-add-feeding',
  templateUrl: 'add-feeding.html',
})
export class AddFeedingPage {
  private foodSelected = [];

  private carbs = 0.0;
  private proteins = 0.0;
  private fats = 0.0;
  private fiber = 0.0;
  private alcohol = 0.0;
  private kcal = 0.0;

  private data;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private messageService: DiaMessageService,
              private timelineService: DiaTimelineService,
              private viewCtrl: ViewController) {
  
    // get data
    this.data = this.navParams.get("data");
    console.log(JSON.stringify(this.data));
  }

  ionViewDidLoad() {
  }

  openFoodSelection(){
    let modal = this.modalCtrl.create(SearchFoodPage, {});
    
    modal.onDidDismiss((food) => {
      if(!!food) {
        this.foodSelected.push(food);
        this.recalculateTotals();
      }
    });
    modal.present();
  }

  recalculateTotals() {
    this.carbs = 0.0;
    this.proteins = 0.0;
    this.fats = 0.0;
    this.fiber = 0.0;
    this.alcohol = 0.0;
    this.kcal = 0.0;

    for(let food of this.foodSelected) {
      let weight;

      if (+food.units_selected > 0) {
        weight = +food.g_or_ml_per_unit * +food.units_selected;
      } else {
        weight = +food.g_or_ml_selected;
      }

      this.carbs += +food.carb_factor * weight;
      this.proteins += +food.protein_factor * weight;
      this.fats += +food.fat_factor * weight;
      this.fiber += +food.fiber_factor * weight;
      this.alcohol += +food.alcohol_factor * weight;

      this.kcal += (this.carbs * 4.0) + (this.proteins * 4.0) + (this.fats * 9.0) + (this.alcohol * 7.0);
    }

    this.carbs = Math.round(this.carbs * 10) / 10;
    this.proteins = Math.round(this.proteins * 10) / 10;
    this.fats = Math.round(this.fats * 10) / 10;
    this.fiber = Math.round(this.fiber * 10) / 10;
    this.alcohol = Math.round(this.alcohol * 10) / 10;
    this.kcal = Math.round(this.kcal);
    
  }

  finishFeeding(){
    let message = new DiaMessage("Finish Feeding", null, "Are you sure to finish selecting foods?");
    this.messageService.confirmMessage(message).subscribe(
      (ok) => {
        if(ok) {
          // confirmed
          this.timelineService.saveFeeding(this.foodSelected).subscribe(
            (feeding) => {
              this.viewCtrl.dismiss({add: true});
            }
          );
        } else {
          // not confirmed
        }
      }
    )
  }
}

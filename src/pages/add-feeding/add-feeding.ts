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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private messageService: DiaMessageService,
              private timelineService: DiaTimelineService,
              private viewCtrl: ViewController) {}

  ionViewDidLoad() {
  }

  openFoodSelection(){
    let modal = this.modalCtrl.create(SearchFoodPage, {});
    
    modal.onDidDismiss((food) => {
      if(!!food && food) {
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
      console.log(JSON.stringify(food));
      let weight = +food.weight
      if (food.weight_per_unit > 0.0) {
        weight = +food.weight_per_unit * +food.units;
      }

      if(food.total_gr_ml > 0.0) {
        this.carbs += (+food.carb_gr / +food.total_gr_ml) * weight;
        this.proteins += (+food.protein_gr / +food.total_gr_ml) * weight;
        this.fats += (+food.fat_gr / +food.total_gr_ml) * weight;
        this.fiber += (+food.fiber_gr / +food.total_gr_ml) * weight;
        this.alcohol += (+food.alcohol_gr / +food.total_gr_ml) * weight;
        this.kcal += (this.carbs * 4.0) + (this.proteins * 4.0) + (this.fats * 9.0) + (this.alcohol * 7.0);
      }
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

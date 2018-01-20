import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../../pages/add-feeding-search-food-add-food/add-food';
import { IntroduceFoodWeightOrUnitsPage } from '../../pages/add-feeding-introduce-food-weight-or-units/introduce-food-weight-or-units';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-search-food',
  templateUrl: 'search-food.html',
})
export class SearchFoodPage {
  private results = [];
  private myFoods = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {

    this.timelineService.getFoods(false).subscribe(
      (foods) => {
        this.myFoods = foods;
        this.results = this.myFoods;
      }
    );
  }

  onInput(event) {
    let searchString = event.target.value;
    if (!searchString){
      this.results = this.myFoods;
    } else {
      this.timelineService.searchFood(searchString).subscribe(
        (results) => {
          this.results = results;
        }
      );
    }
  }

  onCancel($event) {
  }

  addFood(){
    let modal = this.modalCtrl.create(AddFoodPage, {});
    
    modal.onDidDismiss((food) => {
      if(!!food && food["add"]) {
        // aquí hay que añadir el puto alimento.
      }
    });
    modal.present();

  }

  foodSelected(food) {
    if (food.hasOwnProperty('source_name')) {
      this.timelineService.searchedFoodDetails(food.source_name, food.source_id).subscribe(
        (detailedFood) => {
          this.openSelectionModal(detailedFood);
        }
      )
    } else {
      this.openSelectionModal(food);
    }
  }

  private openSelectionModal(defailedFood) {
    let modal = this.modalCtrl.create(IntroduceFoodWeightOrUnitsPage, {"food": defailedFood});
    
    modal.onDidDismiss((data) => {
      if(!!data && data.food) {
        this.viewCtrl.dismiss(data.food);
      }
    });
    modal.present();

  }
}

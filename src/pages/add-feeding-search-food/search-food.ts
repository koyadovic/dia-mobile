import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../add-feeding-search-food-add-food/add-food';

import { IntroduceFoodWeightOrUnitsPage } from '../../pages/add-feeding-introduce-food-weight-or-units/introduce-food-weight-or-units';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-search-food',
  templateUrl: 'search-food.html',
})
export class SearchFoodPage {
  private food_tab = 'recent';

  private recentFoods = null;
  private recentSearchString = '';

  private favoriteFoods = null;
  private favoriteSearchString = '';

  private internetFoods = null;
  private internetSearchString = '';

  private resultFoods = [];
  private resultSearchString = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              public loadingCtrl: LoadingController) {

    this.switchToRecent();
  }

  onInput(event) {
    let searchString = event.target.value;
    if(this.food_tab === 'recent') {
      this.recentSearchString = searchString;
      if (!searchString){
        this.resultFoods = this.recentFoods;
      } else {
        this.resultFoods = this.recentFoods.filter((food) => {
          searchString.toLowerCase().indexOf(food.name.toLowerCase()) >= 0
        });
      }
    }
    else if(this.food_tab === 'favorite') {
      this.favoriteSearchString = searchString;
      if (!searchString){
        this.resultFoods = this.favoriteFoods;
      } else {
        this.resultFoods = this.favoriteFoods.filter((food) => {
          searchString.toLowerCase().indexOf(food.name.toLowerCase()) >= 0
        });
      }
    }
    else {
      this.internetSearchString = searchString;
      if (!searchString){
        this.internetFoods = []
        this.resultFoods = this.internetFoods;
      } else {
        // let loading = this.loadingCtrl.create({showBackdrop: false});
        // loading.present();
        this.timelineService.searchFood(searchString).subscribe(
          (results) => {
            this.internetFoods = results;
            this.resultFoods = this.internetFoods;
            // loading.dismiss();
          }
        );
      }
    }
  }

  switchToRecent(forceReload?:boolean) {
    this.food_tab = 'recent';
    this.resultSearchString = this.recentSearchString;

    if(this.recentFoods === null || forceReload) {
      // let loading = this.loadingCtrl.create({showBackdrop: false});
      // loading.present();
      // llamada a backend para coger los foods
      this.timelineService.getFoods(false).subscribe(
        (foods) => {
          console.log(foods);
          this.recentFoods = foods;
          this.resultFoods = this.recentFoods;
          // loading.dismiss();
        }
      )
    } else {
      this.resultFoods = this.recentFoods;
    }
  }
  switchToFavorite(forceReload?:boolean) {
    this.food_tab = 'favorite';
    this.resultSearchString = this.favoriteSearchString;

    if(this.favoriteFoods === null || forceReload) {
      // let loading = this.loadingCtrl.create({showBackdrop: false});
      // loading.present();
      // llamada a backend para coger los foods
      this.timelineService.getFoods(true).subscribe(
        (foods) => {
          console.log(foods);
          this.favoriteFoods = foods;
          this.resultFoods = this.favoriteFoods;
          // loading.dismiss();
        }
      )
    } else {
      this.resultFoods = this.favoriteFoods;
    }
  }
  switchToInternet() {
    this.food_tab = 'internet';
    this.resultSearchString = this.internetSearchString;

    if (this.internetFoods === null) {
      this.resultFoods = [];
    } else {
      this.resultFoods = this.internetFoods;
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

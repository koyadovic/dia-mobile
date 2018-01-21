import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../add-feeding-search-food-add-food/add-food';

import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'page-add-feeding',
  templateUrl: 'add-feeding.html',
})
export class AddFeedingPage {
  // For food listings
  private food_tab = 'favorite';

  private favoriteFoods = null;
  private favoriteFoodsReload = true;
  private favoriteSearchString = '';

  private recentFoods = null;
  private recentFoodsReload = true;
  private recentSearchString = '';

  private internetFoods = null;
  private internetSearchString = '';

  private resultFoods = [];
  private resultSearchString = '';

  // food selections
  footerState: IonPullUpFooterState;
  private foodSelected = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              public loadingCtrl: LoadingController) {

    this.switchToFavorite();
    this.footerState = IonPullUpFooterState.Collapsed;
  }
  
  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  private filterFoods(arrayFoods, string) {
    return arrayFoods.filter(food => food.name.toLowerCase().indexOf(string.toLowerCase()) >= 0);
  }

  onInput(event) {
    let searchString = event.target.value;
    if(this.food_tab === 'recent') {
      this.recentSearchString = searchString;
      this.resultFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
    }
    else if(this.food_tab === 'favorite') {
      this.favoriteSearchString = searchString;
      this.resultFoods = this.filterFoods(this.favoriteFoods, this.favoriteSearchString);
    }
    else {
      this.internetSearchString = searchString;
      if (!searchString){
        this.internetFoods = []
        this.resultFoods = this.internetFoods;
      } else {
        this.timelineService.searchFood(searchString).subscribe(
          (results) => {
            this.internetFoods = results;
            this.resultFoods = this.internetFoods;
          }
        );
      }
    }
  }

  switchToRecent() {
    this.food_tab = 'recent';
    this.resultSearchString = this.recentSearchString;

    if(this.recentFoods === null || this.recentFoodsReload) {
      this.recentFoodsReload = false;
      this.timelineService.getFoods(false).subscribe(
        (foods) => {
          this.recentFoods = foods;
          this.resultFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
        }
      )
    } else {
      this.resultFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
    }
  }
  switchToFavorite() {
    this.food_tab = 'favorite';
    this.resultSearchString = this.favoriteSearchString;

    if(this.favoriteFoods === null ||  this.favoriteFoodsReload) {
      this.favoriteFoodsReload = false;
      this.timelineService.getFoods(true).subscribe(
        (foods) => {
          this.favoriteFoods = foods;
          this.resultFoods = this.filterFoods(this.favoriteFoods, this.favoriteSearchString);
        }
      )
    } else {
      this.resultFoods = this.filterFoods(this.favoriteFoods, this.favoriteSearchString);
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

  foodfdsafdsaSelected(food) {
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
    /*
    let modal = this.modalCtrl.create(IntroduceFoodWeightOrUnitsPage, {"food": defailedFood});
    
    modal.onDidDismiss((data) => {
      if(!!data && data.food) {
        this.viewCtrl.dismiss(data.food);
      }
    });
    modal.present();
    */

  }
}

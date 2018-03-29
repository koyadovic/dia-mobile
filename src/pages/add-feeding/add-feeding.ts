import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../add-feeding-search-food-add-food/add-food';

import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

import { IonPullUpFooterState } from 'ionic-pullup';
import { InternetFoodList, FoodSelected } from '../../models/food-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-add-feeding',
  templateUrl: 'add-feeding.html',
})
export class AddFeedingPage {
  // For food listings
  private food_tab = 'recent';

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
  private foodSelected:FoodSelected[] = [];

  private footerCurrentlyExpanded: boolean = false;

  // this two is to hjide the ribbon for add food.
  // if selecting or editing, the ribbon must be hide
  private editingFood: boolean = false;
  private selectingFood: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translate: TranslateService,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {

    this.switchToRecent();
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  foodActionMessage(message:string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  footerExpanded() {
    this.footerCurrentlyExpanded = true;
  }

  footerCollapsed() {
    this.footerCurrentlyExpanded = false;
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  private filterFoods(arrayFoods, string) {
    if(string !== undefined) {
      return arrayFoods.filter(food => food.name.toLowerCase().indexOf(string.toLowerCase()) >= 0);
    }
    else {
      return arrayFoods;
    }
  }

  selectedFood(foodSelected: FoodSelected){
    // foodSelected here it's a copy
    this.foodSelected.push(foodSelected);

    // if we does not clone the array, angular does not detect changes
    this.foodSelected = this.foodSelected.slice();
  }

  unselectedFood(food: FoodSelected) {
    let i = this.foodSelected.indexOf(food);
    if (i > -1) {
      this.foodSelected.splice(i, 1);
      this.translate.get('Removed from list').subscribe(mess => this.foodActionMessage(mess));
      this.foodSelected = this.foodSelected.slice();
    }
  }

  onInput(event) {
    let searchString = event.target.value;
    if(this.food_tab === 'recent') {
      this.recentSearchString = searchString === undefined ? '' : searchString;
      this.resultFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
    }
    else if(this.food_tab === 'favorite') {
      this.favoriteSearchString = searchString === undefined ? '' : searchString;
      this.resultFoods = this.filterFoods(this.favoriteFoods, this.favoriteSearchString);
    }
    else {
      this.internetSearchString = searchString === undefined ? '' : searchString;
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

  onCancel($event) {
  }


  switchToRecent() {
    this.food_tab = 'recent';
    this.resultSearchString = this.recentSearchString;

    if(this.recentFoods === null || this.recentFoodsReload) {
      this.recentFoodsReload = false;
      this.refreshRecentFood();
    } else {
      this.resultFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
    }
  }
  switchToFavorite() {
    this.food_tab = 'favorite';
    this.resultSearchString = this.favoriteSearchString;

    if(this.favoriteFoods === null ||  this.favoriteFoodsReload) {
      this.favoriteFoodsReload = false;
      this.refreshFavoriteFood();
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

  addFood(){
    let modal = this.modalCtrl.create(AddFoodPage, {});
    modal.onDidDismiss((food) => {
      if(!!food) {
        this.refreshRecentFood();
      }
    });
    modal.present();
  }

  refreshRecentFood() {
    this.timelineService.getFoods(false).subscribe(
      (foods) => {
        this.recentFoods = foods;
        this.recentFoods = this.filterFoods(this.recentFoods, this.recentSearchString);
        if(this.food_tab === 'recent') {
          this.resultFoods = this.recentFoods;
        }
      }
    );
  }

  refreshFavoriteFood(){
    this.timelineService.getFoods(true).subscribe(
      (foods) => {
        this.favoriteFoods = foods;
        this.favoriteFoods = this.filterFoods(this.favoriteFoods, this.favoriteSearchString);
        if(this.food_tab === 'favorite') {
          this.resultFoods = this.favoriteFoods;
        }
      }
    );
  }

  refresh(food) {
    this.refreshFavoriteFood();
    this.refreshRecentFood();
  }


  finishFeeding() {
    this.timelineService.saveFeeding(this.foodSelected).subscribe(
      (resp) => {
        this.translate.get('Feeding added correctly').subscribe(mess => this.foodActionMessage(mess));
        this.viewCtrl.dismiss({'add': true});
      }
    )
  }
}

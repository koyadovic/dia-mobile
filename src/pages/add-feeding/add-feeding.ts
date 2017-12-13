import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SearchFoodPage } from '../../pages/search-food/search-food';


@Component({
  selector: 'page-add-feeding',
  templateUrl: 'add-feeding.html',
})
export class AddFeedingPage {
  private foodSelected = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController) {}

  ionViewDidLoad() {
  }

  openFoodSelection(){
    let modal = this.modalCtrl.create(SearchFoodPage, {});
    
    modal.onDidDismiss((food) => {
      if(!!food && food["add"]) {
        this.foodSelected.push(food);
      }
    });
    modal.present();
  }
}

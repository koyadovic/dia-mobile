import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../../pages/add-food/add-food';


@Component({
  selector: 'page-search-food',
  templateUrl: 'search-food.html',
})
export class SearchFoodPage {
  private searchString:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController) {}

  ionViewDidLoad() {
  }

  onInput($event) {

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
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-search-food',
  templateUrl: 'search-food.html',
})
export class SearchFoodPage {
  private searchString:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {}

  ionViewDidLoad() {
  }

  onInput($event) {

  }

  onCancel($event) {

  }
}

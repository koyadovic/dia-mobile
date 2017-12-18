import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AddFoodPage } from '../../pages/add-food/add-food';
import { IntroduceFoodWeightOrUnitsPage } from '../../pages/introduce-food-weight-or-units/introduce-food-weight-or-units';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-search-food',
  templateUrl: 'search-food.html',
})
export class SearchFoodPage {
  private results = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {}

  ionViewDidLoad() {
  }

  onInput(event) {
    let searchString = event.target.value;
    if (searchString === ""){
      this.results = [];
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
    let modal = this.modalCtrl.create(IntroduceFoodWeightOrUnitsPage, {"food": food});
    
    modal.onDidDismiss((data) => {
      if(!!data && data.food) {
        this.viewCtrl.dismiss(data.food);
      }
    });
    modal.present();
  }
}

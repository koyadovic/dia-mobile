import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../timeline/timeline';
import { PlanningsPage } from '../plannings/plannings';
import { StatsPage } from '../stats/stats';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  tab1 = TimeLinePage;
  tab2 = PlanningsPage;
  tab3 = StatsPage;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


}

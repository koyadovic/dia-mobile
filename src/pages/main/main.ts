import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../timeline/timeline';
import { PlanningsPage } from '../plannings/plannings';
import { StatsPage } from '../stats/stats';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  tab1 = TimeLinePage;
  tab2 = PlanningsPage;
  tab3 = StatsPage;


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService) {
  }


}

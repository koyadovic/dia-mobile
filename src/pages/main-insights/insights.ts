import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tab-insights',
  templateUrl: 'insights.html',
})
export class InsightsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translate: TranslateService) {
  }
}

import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tab-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {

  constructor(public navCtrl: NavController,
              private appCtrl: App,
              public navParams: NavParams,
              private translate: TranslateService) {
  }

  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }


}

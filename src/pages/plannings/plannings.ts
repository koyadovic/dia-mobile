import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tab-plannings',
  templateUrl: 'plannings.html',
})
export class PlanningsPage {

  constructor(private navCtrl: NavController,
              private appCtrl: App,
              private navParams: NavParams,
              private translate: TranslateService) {
  }

  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }
}

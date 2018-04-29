import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { UserConfiguration } from '../../utils/user-configuration';

@Component({
  selector: 'page-initial-configuration',
  templateUrl: 'initial-configuration.html',
})
export class InitialConfigurationPage {
  @ViewChild(Slides) slides: Slides;
  data = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              private configurationService: DiaConfigurationService) {

    this.configurationService.isReady().subscribe(
      (ready) => {

        if(ready) {
          // here we need to set up all the variables that will be modificable in this page
          let userConfig = this.configurationService.getUserConfiguration();
          this.data[UserConfiguration.LANGUAGE] = userConfig.getValue(UserConfiguration.LANGUAGE);
        }
      }
    );
  }

  ionViewDidLoad() {
  }

  languageChange(language){
    // this is a special case. On language change need to restart this initial configuration page with new language
    this.data[UserConfiguration.LANGUAGE] = language;
    this.saveConfig();
    this.navCtrl.pop();
  }

  next() {
    this.slides.slideNext();
  }

  finished() {
    // here we save the configuration and window.location.href = '/';
    window.location.href = '/';
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.data);
  }

}

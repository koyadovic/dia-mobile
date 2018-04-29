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

  // this is for the timezone selector component
  timezoneOptions = [];

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
    // this is a special case. On language change, we need to restart this initial configuration page with new language
    this.data[UserConfiguration.LANGUAGE] = language;
    this.saveConfig();
    this.navCtrl.pop();
  }

  next() {
    // used for a next button. Currently deprecated
    this.slides.slideNext();
  }

  finished() {
    // here we save the configuration and window.location.href = '/'; to restart all the aplication

    //this.data[UserConfiguration.INITIAL_CONFIG_DONE] = true;
    //this.saveConfig();
    setTimeout(() => window.location.href = '/', 500);
    
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.data);
  }

}

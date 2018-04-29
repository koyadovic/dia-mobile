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
          this.data[UserConfiguration.TIMEZONE] = Intl.DateTimeFormat().resolvedOptions().timeZone;

          /* TODO revisar esta mierda */
          this.configurationService.getConfiguration().subscribe(
            (configuration) => {
              for(let configurationElement of configuration['fields']) {
                if(configurationElement['namespace_key'] === 'dia_config__timezone') {
                  this.timezoneOptions = configurationElement['options'];
                  break;
                }
              }
            }
          );

          // Para coger el país de un timezone ==> GET v1/configurations/country-timezones/?timezone=Europe%2FMadrid
          // Usa Intl.DateTimeFormat().resolvedOptions().timeZone

          // Para coger diversos timezones de un país ==> GET /v1/configurations/country-timezones/ES/
          
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

  onSelectClicked (): void {
    // This scroll to selected option in the timezone ion-select field.

    // These classes come from the generated elements for the ion-select/ion-option
    const options: HTMLCollectionOf<Element> = document.getElementsByClassName('alert-tappable alert-radio');
    setTimeout(() => {
      let i: number = 0
      const len: number = options.length
      for (i; i < len; i++) {
        if ((options[i] as HTMLElement).attributes[3].nodeValue === 'true') {
          options[i].scrollIntoView({ block: 'end', behavior: 'instant' })
        }
      }
    }, 2000) // Leave enough time for the popup to render
  }

}

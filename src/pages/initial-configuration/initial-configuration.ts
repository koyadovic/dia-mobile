import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { UserConfiguration } from '../../utils/user-configuration';
import { TimezoneGuardService } from '../../services/timezone-guard-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-initial-configuration',
  templateUrl: 'initial-configuration.html',
})
export class InitialConfigurationPage {
  @ViewChild(Slides) slides: Slides;

  countryOptions = [];
  timezoneOptions = [];

  data = {};

  dietAndExercise: boolean = false;
  dietAndExerciseFields = [];

  birthDateField = null;

  // subscriptions
  subscriptions = [];

  configReady = false;
  timezoneReady = false;

  completed = false;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              private configurationService: DiaConfigurationService,
              private timezoneGuard: TimezoneGuardService) {


    this.updateAvailableCountryOptions();

    this.subscriptions.push(this.configurationService.isReady().subscribe(ready => {
      if(ready) {
        this.configReady = ready;
        this.initializePage();
      }
    }));

    this.subscriptions.push(this.timezoneGuard.getReady().subscribe(ready => {
      if(ready) {
        this.timezoneReady = ready;
        this.initializePage();
      }
    }));

    this.subscriptions.push(this.configurationService.getConfiguration().subscribe(
      wholeConfig => {
        // check if we have diet and exercise config options
        this.dietAndExercise = false;
        for(let childNode of wholeConfig['children_nodes']) {
          if(childNode['namespace'] === 'diet_and_exercise') {
            this.dietAndExercise = true;
            this.dietAndExerciseFields = childNode['fields'];

            // set defaults
            for(let field of this.dietAndExerciseFields) {
              this.data[field['namespace_key']] = field['value'];
            }
            break;
          }
        }

        // here we get the birth date and run conversion
        for(let field of wholeConfig['fields']) {
          if(field['namespace_key'] === 'dia_config__birth_date') {
            this.birthDateField = field;
            let tzoffset = (new Date()).getTimezoneOffset() * 60000;
            if (!this.birthDateField.value || this.birthDateField.value === "invalid") {
              this.birthDateField.value  = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            } else {
              this.birthDateField.value  = (new Date(new Date(this.birthDateField.value).getTime() - tzoffset)).toISOString().slice(0, -1);
            }
            break;
          }
        }
      }
    ));

  }

  ionViewWillLeave() {
    if(!this.completed) {
      this.platform.exitApp();
    }
  }

  initializePage() {
    if(this.timezoneReady && this.configReady) {
      let newGPSInfo = this.timezoneGuard.getNewGPSInfo();
      let userConfig = this.configurationService.getUserConfiguration();
      this.data = userConfig.getRawData();
      this.data[UserConfiguration.TIMEZONE] = newGPSInfo['timezone'];
      this.data['dia_config__foods__country_for_searches'] = newGPSInfo['country']['code'];
  
      this.updateTimezoneOptionsByCountry();
    }
  }

  updateBirthDateValue() {
    this.data['dia_config__birth_date'] = new Date(this.birthDateField.value).valueOf();
  }

  updateAvailableCountryOptions() {
    // get all available countries
    this.timezoneGuard.getAvailableCountries().subscribe(
      (countries) => {
        this.countryOptions = countries;
      }
    );
  }

  updateTimezoneOptionsByCountry() {
    this.timezoneGuard.getTimezones(this.data['dia_config__foods__country_for_searches']).subscribe(
      (timezones) => {
        this.timezoneOptions = timezones;
        this.data[UserConfiguration.TIMEZONE] = timezones.length > 0 ? timezones[0]['value'] : undefined;
      }
    );
  }

  languageChange(language){
    // this is a special case. On language change, we need to restart this initial configuration page with new language
    this.data = {};
    this.data[UserConfiguration.LANGUAGE] = language;
    this.saveConfig();

    // clear subscriptions
    for(let sub of this.subscriptions){
      sub.unsubscribe();
    }

    this.navCtrl.pop();
  }

  next() {
    // used for a next button. Currently deprecated
    this.slides.slideNext();
  }

  finished() {
    // here we save the configuration and document.location.href = ''; to restart all the aplication
    this.data[UserConfiguration.INITIAL_CONFIG_DONE] = true;
    this.saveConfig();
    this.completed = true;
    setTimeout(() => document.location.href = '', 500);  
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.data);
  }

  // Useful for long ion-select widgets to scroll down to current selected item.
  onSelectClicked(): void {
    // This scroll to selected option in the timezone ion-select field.
    // These classes come from the generated elements for the ion-select/ion-option
    const options: HTMLCollectionOf<Element> = document.getElementsByClassName('alert-tappable alert-radio');
    setTimeout(() => {
      let i: number = 0;
      const len: number = options.length;
      for (i; i < len; i++) {
        if ((options[i] as HTMLElement).attributes[3].nodeValue === 'true') {
          options[i].scrollIntoView({ block: 'end', behavior: 'instant' });
        }
      }
    }, 2000); // Leave enough time for the popup to render
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { UserConfiguration } from '../../utils/user-configuration';
import { TimezoneGuardService } from '../../services/timezone-guard-service';

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
  configurationServiceSubscription = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              private configurationService: DiaConfigurationService,
              private timezoneGuard: TimezoneGuardService) {


    this.updateAvailableCountryOptions();

    this.configurationServiceSubscription = this.configurationService.isReady().subscribe(
      (ready) => {

        if(ready) {
          // here we need to set up all the variables that will be modificable in this page
          let userConfig = this.configurationService.getUserConfiguration();
          this.data = userConfig.getRawData();

          //this.data[UserConfiguration.LANGUAGE] = userConfig.getValue(UserConfiguration.LANGUAGE);
          this.data[UserConfiguration.TIMEZONE] = timezoneGuard.getNewTimezone();

          // need to populate selects with data
          // first we try to get local timezone and with it, the country
          this.updateCountryByNewTimezone();

          this.configurationService.getConfiguration().subscribe(
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
          )
        }
      }
    );

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

  updateCountryByNewTimezone() {
    this.timezoneGuard.getCountry(this.data[UserConfiguration.TIMEZONE]).subscribe(
      (country) => {
        this.data['dia_config__foods__country_for_searches'] = country['value'];
        this.updateTimezoneOptionsByCountry();
      }
    );
  }


  languageChange(language){
    // this is a special case. On language change, we need to restart this initial configuration page with new language
    this.data[UserConfiguration.LANGUAGE] = language;
    this.saveConfig();

    // clear subscriptions
    this.configurationServiceSubscription.unsubscribe();
    this.navCtrl.pop();
  }

  next() {
    // used for a next button. Currently deprecated
    this.slides.slideNext();
  }

  finished() {
    // here we save the configuration and window.location.href = '/'; to restart all the aplication
    this.data[UserConfiguration.INITIAL_CONFIG_DONE] = true;
    this.saveConfig();
    setTimeout(() => window.location.href = '/', 500);
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.data);
  }

}

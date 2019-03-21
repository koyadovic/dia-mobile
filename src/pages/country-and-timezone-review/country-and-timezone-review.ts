import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { TimezoneGuardService } from '../../services/timezone-guard-service';
import { UserConfiguration } from '../../utils/user-configuration';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';
import { DiaConfigurationService } from '../../services/dia-configuration-service';


@Component({
  selector: 'page-country-and-timezone-review',
  templateUrl: 'country-and-timezone-review.html',
})
export class CountryAndTimezoneReviewPage {

  data = {};
  countryOptions = [];
  timezoneOptions = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public translate: TranslateService,
              public toastCtrl: ToastController,
              public timezoneGuard: TimezoneGuardService,
              public messageService: DiaMessageService,
              public configurationService: DiaConfigurationService) {

    this.updateAvailableCountryOptions();
    
    let newGPSInfo = this.navParams.get("newGPSInfo");
    this.data[UserConfiguration.TIMEZONE] = newGPSInfo['timezone'];
    this.data['dia_config__foods__country_for_searches'] = newGPSInfo['country']['code'];
    this.updateTimezoneOptionsByCountry();
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
      }
    );
  }


  closeAndConfirm() {
    forkJoin(
      this.translate.get('Save changes?'),
    ).subscribe(([title]) => {
      let diaMessage = new DiaMessage(title, null, '');
      this.messageService.confirmMessage(diaMessage).subscribe(
        (ok) => {
          if(ok) {
            // first save data
            this.saveConfig();

            // close this
            this.viewCtrl.dismiss(this.data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });

  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.data);
  }


}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { MainPage } from '../main/main';
import { App } from 'ionic-angular/components/app/app';
import { ConfigurationPage } from '../configuration/configuration';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Events } from 'ionic-angular';
import { DiaMessage } from '../../models/messages-model';
import { DiaAuthService } from '../../services/dia-auth-service';
import { DiaMessageService } from '../../services/dia-message-service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Storage } from '@ionic/storage/dist/storage';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { UserConfiguration } from '../../utils/user-configuration';
import { InitialConfigurationPage } from '../initial-configuration/initial-configuration';
import { TimezoneGuardService } from '../../services/timezone-guard-service';
import { CountryAndTimezoneReviewPage } from '../country-and-timezone-review/country-and-timezone-review';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  private rootPage =  MainPage;
  private selectedIndex: number = 0;
  private email: string = '';

  isDiabetic: boolean = false;

  constructor(public navCtrl: NavController,
              private appCtrl: App,
              public menuCtrl: MenuController,
              public navParams: NavParams,
              public events: Events,
              private modalCtrl: ModalController,
              private authenticationService: DiaAuthService,
              private messageService: DiaMessageService,
              private configService: DiaConfigurationService,
              private translate: TranslateService,
              public toastCtrl: ToastController,
              private timezoneGuard: TimezoneGuardService,
              private storage: Storage) {

    this.events.subscribe('response:change:tab', (index) => {
      this.selectedIndex = index;
    });

    this.storage.get('email').then((email) => this.email = email);
    this.isDiabetic = this.authenticationService.isDiabetic();

    // this checks if initial configuration was executed, if not, start initial configuration screen
    this.configService.isReady().subscribe(
      ready => {
        if(ready) {
          let userConfig = this.configService.getUserConfiguration();
          if(! userConfig.getValue(UserConfiguration.INITIAL_CONFIG_DONE)) {

            // here we need to start initial configuration assistant to help users to configure
            // their languages, medications, timezone, date formats, and so on.
            this.appCtrl.getRootNavs()[0].push(InitialConfigurationPage);
          }
        }
      }
    );

    this.timezoneGuard.getChanged().subscribe(
      changed => {
        if(changed) {
          let userConfig = this.configService.getUserConfiguration();
          if(userConfig.getValue(UserConfiguration.INITIAL_CONFIG_DONE)) {
            // TODO need to start timezone changed page
            this.openCountryAndTimezoneReview();
          }
        }
      }
    )
  }

  openCountryAndTimezoneReview() {
    let modal = this.modalCtrl.create(CountryAndTimezoneReviewPage, {newGPSInfo: this.timezoneGuard.getNewGPSInfo()});
    modal.onDidDismiss((data) => {
      if(!!data) {
        // toast message, los datos fueron actualizados
        this.translate.get('The configuration was updated correctly').subscribe(message => {
          this.toastMessage(message);
        });
      }
    });
    modal.present();
  }

  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }

  eventGoTab(index: number){
    this.events.publish('request:change:tab', index);
  }

  logout(){
    forkJoin(
      this.translate.get("Logout Confirmation"),
      this.translate.get("Are you sure to close your session?")
    ).subscribe(([title, message]) => {
      let diamessage = new DiaMessage(title, "info", message)
      this.messageService.confirmMessage(diamessage).subscribe((ok) => { if (ok) this.authenticationService.logout(); });
    });
  }

  toastMessage(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

}

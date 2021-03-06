import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../main-timeline/timeline';
import { PlanningsPage } from '../main-plannings/plannings';
import { InsightsPage } from '../main-insights/insights';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Tabs } from 'ionic-angular/navigation/nav-interfaces';
import { Events } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular/platform/platform';
import { DiaRestBackendService } from '../../services/dia-rest-backend-service';
import { DiaBackendURL } from '../../services/dia-backend-urls';
import { Storage } from '@ionic/storage';
import { UserMedicationsPage } from '../user-medications/user-medications';
import { DiaAuthService } from '../../services/dia-auth-service';


@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild("mainTabs") mainTabs: Tabs;

  tab1 = TimeLinePage;
  tab2 = UserMedicationsPage;
  tab3 = PlanningsPage;
  tab4 = InsightsPage;

  timelineTitle = 'Timeline';
  medicationsTitle = 'Medications';
  planningsTitle = 'Plannings';
  insightsTitle = 'Insights';

  isDiabetic: boolean = false;

  constructor(private fcm: FCM,
              private platform: Platform,
              private storage: Storage,
              private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              private events: Events,
              private backendURL: DiaBackendURL,
              private authenticationService: DiaAuthService,
              private restBackendService: DiaRestBackendService) {
    
    forkJoin(
      this.translate.get('Timeline'),
      this.translate.get('Medications'),
      this.translate.get('Routines'),
      this.translate.get('Insights'),
    ).subscribe(
      ([timeline, medications, plannings, insights]) => {
        this.timelineTitle = timeline;
        this.medicationsTitle = medications;
        this.planningsTitle = plannings;
        this.insightsTitle = insights;
      }
    );

    this.isDiabetic = this.authenticationService.isDiabetic();

    // only runs on real device and only if loggedin
    if(this.platform.is('cordova')) {

      // Firebase Cloud Messaging
      this.fcm.getToken().then((token) => { this.checkFCMStoredToken(token); });
      this.fcm.onTokenRefresh().subscribe(token => {this.checkFCMStoredToken(token); });
    }

    this.events.subscribe('request:change:tab', (index) => {
      this.mainTabs.select(index, {}, false);
      this.events.publish('response:change:tab', index);
    });
  }

  private checkFCMStoredToken(newToken: string) {
    // here if new token from FCM is different than the last published to our backend
    // publish it again.
    if(!!newToken) {
      this.storage.get('fcm_token').then((fcm_token) => {
        if(!fcm_token || fcm_token !== newToken) {
          let url = `${this.backendURL.baseURL}/v1/notifications/plugins/fcm/register-token/`;
          this.restBackendService.genericPost(url, {'token': newToken}).subscribe(resp => {});
          this.storage.set('fcm_token', newToken);
        }
      });
    }
  }

  tabClicked(index) {
    this.events.publish('response:change:tab', index);
  }
}

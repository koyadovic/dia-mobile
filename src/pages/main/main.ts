import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../timeline/timeline';
import { PlanningsPage } from '../plannings/plannings';
import { StatsPage } from '../stats/stats';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Tabs } from 'ionic-angular/navigation/nav-interfaces';
import { Events } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular/platform/platform';
import { DiaRestBackendService } from '../../services/dia-rest-backend-service';
import { DiaBackendURL } from '../../services/dia-backend-urls';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild("mainTabs") mainTabs: Tabs;

  tab1 = TimeLinePage;
  tab2 = PlanningsPage;
  tab3 = StatsPage;

  timelineTitle = 'Timeline';
  planningsTitle = 'Plannings';
  statsTitle = 'Stats';

  constructor(private fcm: FCM,
              private platform: Platform,
              private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              public events: Events,
              private backendURL: DiaBackendURL,
              private restBackendService: DiaRestBackendService) {
    
    forkJoin(
      this.translate.get('Timeline'),
      this.translate.get('Plannings'),
      this.translate.get('Stats'),
    ).subscribe(
      ([timeline, plannings, stats]) => {
        this.timelineTitle = timeline;
        this.planningsTitle = plannings;
        this.statsTitle = stats;
      }
    );

    // only runs on real device and only if loggedin
    if(this.platform.is('cordova')) {
      // Firebase Cloud Messaging
      this.fcm.getToken().then((token) => {
        let url = `${this.backendURL.baseURL}/v1/notifications/plugins/fcm/register-token/`;
        this.restBackendService.genericPost(url, {'token': token}).subscribe(
          (resp) => {
            alert("getToken(): " + JSON.stringify(resp));
          }
        );
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        let url = `${this.backendURL.baseURL}/v1/notifications/plugins/fcm/register-token/`;
        this.restBackendService.genericPost(url, {'token': token}).subscribe(
          (resp) => {
            alert("onTokenRefresh(): " + JSON.stringify(resp));
          }
        );
      });
      
      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped) {
          //console.info("Received in background");
        } else {
          //console.info("Received in foreground");
        };
      });
    }
    

    this.events.subscribe('request:change:tab', (index) => {
      this.mainTabs.select(index, {}, false);
      this.events.publish('response:change:tab', index);
    });
  }

  tabClicked(index) {
    this.events.publish('response:change:tab', index);
  }
}

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiaMobileApp } from './app-component';

import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// components
import { ComponentsModule } from '../components/components.module';

// services
import { DiaRestBackendService } from '../services/dia-rest-backend-service';
import { DiaAuthService } from '../services/dia-auth-service';
import { DiaBackendURL } from '../services/dia-backend-urls';
import { DiaMessageService } from '../services/dia-message-service';
import { DiaConfigurationService } from '../services/dia-configuration-service';
import { DiaTimelineService } from '../services/dia-timeline-service';

// pages
import { MenuPage } from '../pages/main-menu/menu';
import { MainPage } from '../pages/main/main';
import { TimeLinePage } from '../pages/main-timeline/timeline';
import { PlanningsPage } from '../pages/main-plannings/plannings';
import { InsightsPage } from '../pages/main-insights/insights';

import { ConfigurationPage } from '../pages/configuration/configuration';
import { InitialConfigurationPage } from '../pages/initial-configuration/initial-configuration';
import { LoginPage } from '../pages/login/login';

import { AddGenericPage } from '../pages/add-generic/add-generic';

import { AddFeedingPage } from '../pages/add-feeding/add-feeding';
import { AddFoodPage } from '../pages/add-feeding-search-food-add-food/add-food';

import { UserMedicationsPage } from '../pages/user-medications/user-medications';
import { InstantCardDetailsPage } from '../pages/instant-card-details/instant-card-details';

import { IonPullupModule } from 'ionic-pullup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DiaPlanningsService } from '../services/dia-plannings-service';
import { PlanningsEditorPage } from '../pages/plannings-editor/plannings-editor';
import { DiaInsightsService } from '../services/dia-insights-service';
import { DiaMedicationsService } from '../services/dia-medications-service';
import { TimezoneGuardService } from '../services/timezone-guard-service';
import { CountryAndTimezoneReviewPage } from '../pages/country-and-timezone-review/country-and-timezone-review';

import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation';
import { GeolocationMock } from '@ionic-native-mocks/geolocation';
import { Observable } from 'rxjs/Observable';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


const isBrowser = document.URL.includes('https://') || document.URL.includes('http://');


export class DiaGeolocationMock extends GeolocationMock {
  here = <Geoposition>{
    coords: <Coordinates>{
      latitude: 40.4443821,
      longitude: -3.6714569,
      accuracy: 15.0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0
    },
    timestamp: 0
  }
  getCurrentPosition(options?: GeolocationOptions): Promise<Geoposition> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {resolve(this.here);}, 500);
      
    });
  }
  watchPosition(options?: GeolocationOptions): Observable<Geoposition> {
    return Observable.create((obs) => obs.next(this.here))
  }
}

@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,

    MenuPage,
    InitialConfigurationPage,
    MainPage,
    TimeLinePage,
    PlanningsPage,
    InsightsPage,

    LoginPage,

    AddGenericPage,
    AddFoodPage,
    AddFeedingPage,

    PlanningsEditorPage,
    UserMedicationsPage,
    InstantCardDetailsPage,
    CountryAndTimezoneReviewPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(DiaMobileApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonPullupModule,
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiaMobileApp,
    ConfigurationPage,

    MenuPage,
    InitialConfigurationPage,
    MainPage,
    TimeLinePage,
    PlanningsPage,
    InsightsPage,

    LoginPage,

    AddFeedingPage,
    AddGenericPage,
    AddFoodPage,

    PlanningsEditorPage,
    UserMedicationsPage,
    InstantCardDetailsPage,
    CountryAndTimezoneReviewPage,
  ],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IonicStorageModule,
    DiaRestBackendService,
    DiaAuthService,
    DiaBackendURL,
    DiaMessageService,
    DiaConfigurationService,
    DiaTimelineService,
    DiaPlanningsService,
    DiaInsightsService,
    DiaMedicationsService,
    TimezoneGuardService,
    (isBrowser ? { provide: Geolocation, useClass: DiaGeolocationMock} : Geolocation)
  ]
})
export class AppModule {}

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiaMobileApp } from './app-component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// components
import { DynamicField } from '../components/dynamic-field/dynamic-field-component';
import { DynamicRoot } from '../components/dynamic-root/dynamic-root-component';
import { DiaInstantCard } from '../components/instant-card/instant-card-component';
import { FoodComponent } from '../components/food/food';

// services
import { DiaRestBackendService } from '../services/dia-rest-backend-service';
import { DiaAuthService } from '../services/dia-auth-service';
import { DiaBackendURL } from '../services/dia-backend-urls';
import { DiaMessageService } from '../services/dia-message-service';
import { DiaConfigurationService } from '../services/dia-configuration-service';
import { DiaWebsocketService } from '../services/dia-websockets-service';
import { DiaTimelineService } from '../services/dia-timeline-service';

// pages
import { MainPage } from '../pages/main/main';
import { TimeLinePage } from '../pages/timeline/timeline';
import { PlanningsPage } from '../pages/plannings/plannings';
import { StatsPage } from '../pages/stats/stats';

import { ConfigurationPage } from '../pages/configuration/configuration';
import { LoginPage } from '../pages/login/login';
import { AddGenericPage } from '../pages/add-generic/add-generic';
import { AddFeedingPage } from '../pages/add-feeding/add-feeding';
import { SearchFoodPage } from '../pages/search-food/search-food';
import { AddFoodPage } from '../pages/add-food/add-food';
import { IntroduceFoodWeightOrUnitsPage } from '../pages/introduce-food-weight-or-units/introduce-food-weight-or-units';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,

    MainPage,
    TimeLinePage,
    PlanningsPage,
    StatsPage,

    LoginPage,

    AddFeedingPage,
    AddGenericPage,
    SearchFoodPage,
    AddFoodPage,
    IntroduceFoodWeightOrUnitsPage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
    FoodComponent
  ],
  imports: [
    BrowserModule,
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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiaMobileApp,
    ConfigurationPage,

    MainPage,
    TimeLinePage,
    PlanningsPage,
    StatsPage,

    LoginPage,

    AddFeedingPage,
    AddGenericPage,
    SearchFoodPage,
    AddFoodPage,
    IntroduceFoodWeightOrUnitsPage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
    FoodComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    BackgroundMode,
    DiaRestBackendService,
    DiaAuthService,
    DiaBackendURL,
    DiaMessageService,
    DiaConfigurationService,
    DiaWebsocketService,
    DiaTimelineService
  ]
})
export class AppModule {}

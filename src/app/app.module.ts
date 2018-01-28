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
import { DiaTimelineService } from '../services/dia-timeline-service';

// pages
import { MenuPage } from '../pages/main-menu/menu';
import { MainPage } from '../pages/main/main';
import { TimeLinePage } from '../pages/main-timeline/timeline';
import { PlanningsPage } from '../pages/main-plannings/plannings';
import { InsightsPage } from '../pages/main-insights/insights';

import { ConfigurationPage } from '../pages/configuration/configuration';
import { LoginPage } from '../pages/login/login';

import { AddGenericPage } from '../pages/add-generic/add-generic';

import { AddFeedingPage } from '../pages/add-feeding/add-feeding';
import { AddFoodPage } from '../pages/add-feeding-search-food-add-food/add-food';

import { FoodEditorComponent } from '../components/food-editor/food-editor';
import { FoodSelectionComponent } from '../components/food-selection/food-selection';
import { FoodSelectedComponent } from '../components/food-selected/food-selected';
import { FoodSummaryComponent } from '../components/food-summary/food-summary';

import { IonPullupModule } from 'ionic-pullup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,

    MenuPage,
    MainPage,
    TimeLinePage,
    PlanningsPage,
    InsightsPage,

    LoginPage,

    AddGenericPage,
    AddFoodPage,
    AddFeedingPage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
    FoodComponent,
    FoodEditorComponent,
    FoodSelectionComponent,
    FoodSelectedComponent,
    FoodSummaryComponent,
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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiaMobileApp,
    ConfigurationPage,

    MenuPage,
    MainPage,
    TimeLinePage,
    PlanningsPage,
    InsightsPage,

    LoginPage,

    AddFeedingPage,
    AddGenericPage,
    AddFoodPage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
    FoodComponent,
    FoodEditorComponent,
    FoodSelectionComponent,
    FoodSelectedComponent,
    FoodSummaryComponent,
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
  ]
})
export class AppModule {}

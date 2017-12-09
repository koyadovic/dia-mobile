import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiaMobileApp } from './app-component';

// pages
import { TimeLinePage } from '../pages/timeline/timeline';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';

import { DynamicField } from '../components/dynamic-field/dynamic-field-component';
import { DynamicRoot } from '../components/dynamic-root/dynamic-root-component';
import { DiaInstantCard } from '../components/instant-card/instant-card-component';

// services
import { DiaRestBackendService } from '../services/dia-rest-backend-service';
import { DiaAuthService } from '../services/dia-auth-service';
import { DiaBackendURL } from '../services/dia-backend-urls';
import { DiaMessageService } from '../services/dia-message-service';
import { DiaConfigurationService } from '../services/dia-configuration-service';
import { DiaWebsocketService } from '../services/dia-websockets-service';
import { DiaTimelineService } from '../services/dia-timeline-service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AddGlucosePage } from '../pages/add-glucose/add-glucose';
import { AddFeedingPage } from '../pages/add-feeding/add-feeding';
import { AddInsulinDosePage } from '../pages/add-insulin-dose/add-insulin-dose';
import { AddPhysicalActivityPage } from '../pages/add-physical-activity/add-physical-activity';
import { AddTraitChangePage } from '../pages/add-trait-change/add-trait-change';


@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,
    TimeLinePage,
    LoginPage,

    AddGlucosePage,
    AddFeedingPage,
    AddInsulinDosePage,
    AddPhysicalActivityPage,
    AddTraitChangePage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(DiaMobileApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiaMobileApp,
    ConfigurationPage,
    TimeLinePage,
    LoginPage,

    AddGlucosePage,
    AddFeedingPage,
    AddInsulinDosePage,
    AddPhysicalActivityPage,
    AddTraitChangePage,

    DynamicField,
    DynamicRoot,
    DiaInstantCard,
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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

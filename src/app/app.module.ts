import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiaMobileApp } from './app-component';

// pages
import { TimeLinePage } from '../pages/timeline/timeline';
import { HomePage } from '../pages/home/home';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { DynamicField } from '../components/dynamic-field/dynamic-field-component';
import { DynamicRoot } from '../components/dynamic-root/dynamic-root-component';

// services
import { DiaRestBackendService } from '../services/dia-rest-backend-service';
import { DiaAuthService } from '../services/dia-auth-service';
import { DiaBackendURL } from '../services/dia-backend-urls';
import { DiaMessageService } from '../services/dia-message-service';
import { DiaConfigurationService } from '../services/dia-configuration-service';

@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,
    TimeLinePage,
    HomePage,
    TabsPage,
    LoginPage,

    DynamicField,
    DynamicRoot,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(DiaMobileApp),
    IonicStorageModule.forRoot(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiaMobileApp,
    ConfigurationPage,
    TimeLinePage,
    HomePage,
    TabsPage,
    LoginPage,
    DynamicField,
    DynamicRoot,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    DiaRestBackendService,
    DiaAuthService,
    DiaBackendURL,
    DiaMessageService,
    DiaConfigurationService
  ]
})
export class AppModule {}

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
import { RestBackendService } from '../providers/rest-backend-service';
import { DiaAuthService } from '../providers/dia-auth-service';
import { DiaBackendURL } from '../providers/dia-backend-urls';
import { DiaAppState } from '../providers/dia-app-state';
import { DiaConfigurationService } from '../providers/dia-configuration-service';

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
    RestBackendService,
    DiaAuthService,
    DiaBackendURL,
    DiaAppState,
    DiaConfigurationService
  ]
})
export class AppModule {}

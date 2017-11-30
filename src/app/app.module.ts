import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiaMobileApp } from './app-component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestBackendService } from '../providers/rest-backend-service/rest-backend-service';

import { IonicStorageModule } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    DiaMobileApp,
    AboutPage,
    HomePage,
    TabsPage,
    LoginPage
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
    AboutPage,
    HomePage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestBackendService,
    Storage,
  ]
})
export class AppModule {}

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

// services
import { DiaRestBackendService } from '../services/dia-rest-backend-service';
import { DiaAuthService } from '../services/dia-auth-service';
import { DiaBackendURL } from '../services/dia-backend-urls';
import { DiaMessageService } from '../services/dia-message-service';
import { DiaConfigurationService } from '../services/dia-configuration-service';
import { DiaWebsocketService } from '../services/dia-websockets-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    DiaMobileApp,
    ConfigurationPage,
    TimeLinePage,
    LoginPage,
    DynamicField,
    DynamicRoot,
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
    DynamicField,
    DynamicRoot,

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
    DiaWebsocketService
  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

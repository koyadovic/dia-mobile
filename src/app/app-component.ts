import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app-component.html'
})
export class DiaMobileApp {
  rootPage:any = null;
  configuration = null;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      storage.get('token').then((val) => {
        this.rootPage = val !== null && val !== '' ? TabsPage : LoginPage;
      });
    });
  }
}

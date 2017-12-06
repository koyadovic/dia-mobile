import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import  { DiaAuthService } from '../services/dia-auth-service'

@Component({
  templateUrl: 'app-component.html'
})
export class DiaMobileApp {
  rootPage:any = null;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private authService: DiaAuthService) {
                
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.loggedIn().subscribe((loggedIn) => this.rootPage = loggedIn ? TabsPage : LoginPage);
    });
  }
}

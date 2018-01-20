import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MainPage } from '../pages/main/main';
import { MenuPage } from '../pages/main-menu/menu';
import { LoginPage } from '../pages/login/login';

import { DiaAuthService } from '../services/dia-auth-service'
import { DiaConfigurationService } from '../services/dia-configuration-service';



@Component({
  templateUrl: 'app-component.html',
})
export class DiaMobileApp {
  rootPage:any;
  private backendMessages$: Observable<any>;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private authService: DiaAuthService,
              private configurationService: DiaConfigurationService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // only runs on real device and only if loggedin
      if(this.platform.is('cordova')) {
      }

      this.authService.loggedIn().subscribe(
        (loggedIn) => {
          if (loggedIn === null) return

          if(loggedIn) { // logged in!
            // rootPage is MainPage
            if(this.rootPage !== MainPage) {
              this.configurationService.isReady().subscribe(
                (ready) => {
                  if(ready) {
                    this.rootPage = MenuPage;
                  }
                }
              );
            }
          } else { // not logged in
            // rootPage is LoginPage
            if(this.rootPage !== LoginPage) {
              this.rootPage = LoginPage;
            }
          }
        }
      );
    });
  }
}

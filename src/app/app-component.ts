import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';

import { DiaAuthService } from '../services/dia-auth-service'
import { DiaWebsocketService } from '../services/dia-websockets-service';
import { MainPage } from '../pages/main/main';
import { DiaConfigurationService } from '../services/dia-configuration-service';
import { MenuPage } from '../pages/menu/menu';


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
              private wsService: DiaWebsocketService,
              private configurationService: DiaConfigurationService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // only runs on real device
      if(this.platform.is('cordova')) {
      }


      this.wsService.isReady().subscribe(
        (ready) => {
          if(ready) {
            // websockets
            this.backendMessages$ = this.wsService.getMessages();
            this.backendMessages$.subscribe(
              (backendMessage) => {
              console.log(backendMessage);
            },
            (error) => {
              console.log("Websockets connection error.");
            });
          }
        }
      );

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

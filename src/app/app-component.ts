import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { TimeLinePage } from '../pages/timeline/timeline';

import { DiaAuthService } from '../services/dia-auth-service'
import { DiaWebsocketService } from '../services/dia-websockets-service';


@Component({
  templateUrl: 'app-component.html',
})
export class DiaMobileApp {
  rootPage:any = TimeLinePage;
  private backendMessages$: Observable<any>;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private backgroundMode: BackgroundMode,
              private authService: DiaAuthService,
              private wsService: DiaWebsocketService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      backgroundMode.enable();

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
            // rootPage is TimeLinePage
            if(this.rootPage !== TimeLinePage) {
              this.rootPage = TimeLinePage;
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

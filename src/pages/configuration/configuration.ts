import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DiaConfigurationService } from '../../providers/dia-configuration-service';
import { DiaAuthService } from '../../providers/dia-auth-service';


@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  configurationPointer = [];

  configurationChanges = {};
  private timerForSave = null;

  constructor(
    public navCtrl: NavController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private configurationService: DiaConfigurationService,
    private authenticationService: DiaAuthService,

  ) {
    this.configurationService.getConfiguration().subscribe(
      (configuration) => {
        this.configurationPointer.push(configuration);
      }
    )
  }

  goBack(){
    this.configurationPointer.pop();
  }

  changeRoot(event) {
    this.configurationPointer.push(event);
  }

  haveChanges(event) {
    this.configurationChanges[event.namespace_key] = event.value;

    if(this.timerForSave != null){clearTimeout(this.timerForSave);}

    this.timerForSave = setTimeout(() => {
      this.configurationService.saveConfiguration(this.configurationChanges)
    }, 2000);
  }

  logout(){
    this.authenticationService.logout();
  }

}

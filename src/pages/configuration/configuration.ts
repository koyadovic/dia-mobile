import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaAuthService } from '../../services/dia-auth-service';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  @ViewChild(Navbar) navBar: Navbar;
  private configurationPointer = [];

  private configurationChanges = {};
  private timerForSave = null;

  constructor(public navCtrl: NavController,
              private configurationService: DiaConfigurationService) {

    this.configurationService.getConfiguration().subscribe(
      (configuration) => {
        this.configurationPointer = [ configuration ];
      }
    );
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     if (this.configurationPointer.length > 1) {
        this.configurationPointer.pop();
      } else {
        this.navCtrl.pop();
      }
    }
  }

  ionViewWillLeave() {
    if(Object.keys(this.configurationChanges).length > 0){
      this.saveConfig();
    }
  }

  haveChanges(event) {
    this.configurationChanges[event.namespace_key] = event.value; 
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.configurationChanges);
    // in case of language change, restart application
    // this is because into the main page, tabs labels at the bottom of the page does not refresh its texts
    // so with this method, we force the reload.
    if(Object.keys(this.configurationChanges).indexOf('dia_config__language') > -1) {
      document.location.href = '';
    }
  }

  changeRoot(event) {
    this.configurationPointer.push(event);
  }


}

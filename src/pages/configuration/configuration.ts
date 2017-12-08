import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaAuthService } from '../../services/dia-auth-service';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';
import { TranslateService } from '@ngx-translate/core';


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
              private configurationService: DiaConfigurationService,
              private authenticationService: DiaAuthService,
              private messageService: DiaMessageService,
              private translate: TranslateService) {

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
        if(Object.keys(this.configurationChanges).length > 0){
          this.configurationService.saveConfiguration(this.configurationChanges);
        }
        this.navCtrl.pop();
      }
    }
  }

  haveChanges(event) { 
    this.configurationChanges[event.namespace_key] = event.value; 
  }

  saveConfig() {
    this.configurationService.saveConfiguration(this.configurationChanges);
  }

  changeRoot(event) {
    this.configurationPointer.push(event);
  }

  logout(){
    let message = new DiaMessage("Logout Confirmation", "info", "Are you sure to close your session?")
    this.messageService.confirmMessage(message).subscribe((ok) => { if (ok) this.authenticationService.logout(); });
  }

}

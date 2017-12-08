import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaAuthService } from '../../services/dia-auth-service';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';


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
              private messageService: DiaMessageService) {

    this.configurationService.getConfiguration().subscribe(
      (configuration) => {
        this.configurationPointer.push(configuration);
      }
    )
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
    let message = new DiaMessage("Logout Confirmation", "info", "Are you sure to close your session?")
    this.messageService.confirmMessage(message).subscribe((ok) => { if (ok) this.authenticationService.logout(); });
  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestBackendService } from '../../providers/rest-backend-service/rest-backend-service';

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  configurationPointer = [];
  configurationChanges = {}
  private timerForSave = null;

  constructor(
    public navCtrl: NavController,
    private restService: RestBackendService
  ) {
    this.configurationPointer.push(restService.configuration);
  }

  goBack(){
    this.configurationPointer.pop();
  }

  changeRoot(event) {
    this.configurationPointer.push(event);
  }

  haveChanges(event) {
    this.configurationChanges[event.namespace_key] = event.value;

    if(this.timerForSave != null){
      clearTimeout(this.timerForSave);
    }

    this.timerForSave = setTimeout(() => {
      this.restService.saveConfiguration(this.configurationChanges).subscribe(
        (resp) => {
            this.configurationChanges = {};
        },
        (err) => {
          console.log(err);
          this.configurationChanges = {};
          this.restService.refreshConfiguration();
        }
      )
    }, 2000);
  }
}

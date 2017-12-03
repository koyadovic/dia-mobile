import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestBackendService } from '../../providers/rest-backend-service/rest-backend-service';

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  configurationPointer = [];

  constructor(
    public navCtrl: NavController,
    private restService: RestBackendService
  ) {
    console.log(this.restService.configuration);
    this.configurationPointer.push(restService.configuration);
  }

  goBack(){
    this.configurationPointer.pop();
  }

  changeRoot(event) {
    this.configurationPointer.push(event);
  }

}

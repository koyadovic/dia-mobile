import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestBackendService } from '../../providers/rest-backend-service/rest-backend-service';

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  configuration = null;
  configurationPointer = null;

  constructor(
    public navCtrl: NavController,
    private restService: RestBackendService
  ) {
    console.log(this.restService.configuration);
    this.configuration = restService.configuration;
    this.configurationPointer = this.configuration;
  }


}

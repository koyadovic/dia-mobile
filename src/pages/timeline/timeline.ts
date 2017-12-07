import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimeLinePage {

  constructor(public navCtrl: NavController) { }

  goConfiguration() {
    this.navCtrl.push(ConfigurationPage);
  }

}

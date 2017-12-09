import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  private instants$: Observable<any>;

  constructor(public navCtrl: NavController) {}

  goConfiguration() {
    this.navCtrl.push(ConfigurationPage);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000)
  }

}

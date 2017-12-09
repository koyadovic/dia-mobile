import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Observable } from 'rxjs/Observable';
import { AddGlucosePage } from '../add-glucose/add-glucose';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';

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

  addGlucose(fab: FabContainer){
    fab.close();
    this.navCtrl.push(AddGlucosePage)
  }

}

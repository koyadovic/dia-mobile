import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { Observable } from 'rxjs/Observable';
import { AddGlucosePage } from '../add-glucose/add-glucose';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { UserConfiguration } from '../../utils/user-configuration';
import { DiaConfigurationService } from '../../services/dia-configuration-service';
import { DiaTimelineService } from '../../services/dia-timeline-service';


@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimeLinePage {
  @ViewChild(FabContainer) fab: FabContainer;
  private timeline$: Observable<any>;
  private userConfig: UserConfiguration;

  constructor(public navCtrl: NavController,
              public configurationService: DiaConfigurationService,
              private timelineService: DiaTimelineService) {

    this.userConfig = this.configurationService.getUserConfiguration();
    this.timeline$ = this.timelineService.getTimeline();
  }

  goConfiguration() {
    this.navCtrl.push(ConfigurationPage);
  }

  doRefresh(refresher) {
    this.timelineService.refreshTimeline();
    setTimeout(() => {
      refresher.complete();
    }, 2000)
  }

  addGlucose(fab: FabContainer){
    fab.close();
    this.navCtrl.push(AddGlucosePage)
  }

  cardClicked(instant) {
    console.log(JSON.stringify(instant));
  }

}

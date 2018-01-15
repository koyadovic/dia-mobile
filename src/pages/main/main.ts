import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../timeline/timeline';
import { PlanningsPage } from '../plannings/plannings';
import { StatsPage } from '../stats/stats';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Tabs } from 'ionic-angular/navigation/nav-interfaces';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild("mainTabs") mainTabs: Tabs;

  tab1 = TimeLinePage;
  tab2 = PlanningsPage;
  tab3 = StatsPage;

  timelineTitle = 'Timeline';
  planningsTitle = 'Plannings';
  statsTitle = 'Stats';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              public events: Events) {
    
    forkJoin(
      this.translate.get('Timeline'),
      this.translate.get('Plannings'),
      this.translate.get('Stats'),
    ).subscribe(
      ([timeline, plannings, stats]) => {
        this.timelineTitle = timeline;
        this.planningsTitle = plannings;
        this.statsTitle = stats;
      }
    );

    this.events.subscribe('request:change:tab', (index) => {
      this.mainTabs.select(index, {}, false);
      this.events.publish('response:change:tab', index);
    });
  }

  tabClicked(index) {
    this.events.publish('response:change:tab', index);
  }
}

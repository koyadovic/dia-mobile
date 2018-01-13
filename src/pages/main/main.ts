import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeLinePage } from '../timeline/timeline';
import { PlanningsPage } from '../plannings/plannings';
import { StatsPage } from '../stats/stats';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  tab1 = TimeLinePage;
  tab2 = PlanningsPage;
  tab3 = StatsPage;

  timelineTitle = 'Timeline';
  planningsTitle = 'Plannings';
  statsTitle = 'Stats';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService) {
    
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
    )
  }
}

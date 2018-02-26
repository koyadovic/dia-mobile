import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';
import { DiaInsightsService } from '../../services/dia-insights-service';
import { Content } from 'ionic-angular';


@Component({
  selector: 'tab-insights',
  templateUrl: 'insights.html',
})
export class InsightsPage {
  @ViewChild(Content) content: Content;

  insightsData = []
  activeInsightSegment:string = '';
  activeInsightSegmentChartData: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translate: TranslateService,
              private insightsService: DiaInsightsService) {

    this.insightsService.getInsights().subscribe(
      (resp) => {
        this.insightsData = resp;
        if(this.insightsData.length > 0) {
          this.activeInsightSegment = this.insightsData[0]['title'];
          this.activeInsightSegmentChartData = this.insightsData[0]['insights'];
        }
      }
    )
  }

  resize() {
    this.content.resize();
  }

  tabChanged(segment){
    this.content.scrollToTop();
    this.activeInsightSegment = segment['title'];
    this.activeInsightSegmentChartData = segment['insights'];
  }
}

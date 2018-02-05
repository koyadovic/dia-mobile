import { Component, Input } from '@angular/core';
import { DiaInsightsService } from '../../services/dia-insights-service';

@Component({
  selector: 'insights-chart',
  templateUrl: 'insights-chart.html'
})
export class InsightsChartComponent {

  @Input() chartData;
  /*
    {
      "name": "General View Columns",
      "url": "http://api-test.diamobile.com/v1/insights/general/view-columns/"
    }
  */
  @Input() show: boolean = false;
  @Input() loadDelayInSeconds: number = 1;

  chartConcreteData;

  constructor(private insightsService: DiaInsightsService) {
  }

  ngOnChanges(changes) {
    if("chartData" in changes) {
      console.log("sleeping " + this.loadDelayInSeconds);
      setTimeout(this.loadChartData.bind(this), this.loadDelayInSeconds * 1000);
    }
  }

  loadChartData() {
    if (!!this.chartData && this.chartData['url']) {
      this.insightsService.getConcreteInsight(this.chartData['url']).subscribe(
        (resp) => {
          console.log(JSON.stringify(resp));
          this.chartConcreteData = resp;
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

}

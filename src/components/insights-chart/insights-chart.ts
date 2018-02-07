import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiaInsightsService } from '../../services/dia-insights-service';

@Component({
  selector: 'insights-chart',
  templateUrl: 'insights-chart.html'
})
export class InsightsChartComponent {

  @Input() chartData;
  @Input() show: boolean = false;
  private concreteChartData = null;

  @Output() chartDataLoaded = new EventEmitter();

  constructor(private insightsService: DiaInsightsService) {}

  ngOnChanges(changes) {
    if("chartData" in changes || "show" in changes) {
      if(!!this.chartData && this.show) {
        if(this.concreteChartData === null){
            this.loadChartData();
        }
      }
    }
  }

  loadChartData() {
    if (!!this.chartData && this.chartData['url']) {
      this.insightsService.getConcreteInsight(this.chartData['url']).subscribe(
        (resp) => {
          this.concreteChartData = resp;
          this.chartDataLoaded.emit();
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

}

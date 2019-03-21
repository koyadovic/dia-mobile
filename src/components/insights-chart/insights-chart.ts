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
          console.error(err);
        }
      )
    }
  }

  private static currentColor = 0;
  private static availableColors = [
    'rgba(0, 118, 177,',
    'rgba(252, 229, 124,',
    'rgba(216, 17, 89,',
    'rgba(255,102,135,',
    'rgba(255, 188, 66,',
    'rgba(143, 45, 86, '
  ]

  public static getCurrentColor(alpha:string, index:number) {
    if (index >= InsightsChartComponent.availableColors.length)
    index -= InsightsChartComponent.availableColors.length;
    return InsightsChartComponent.availableColors[index] + alpha + ')';
  }
}

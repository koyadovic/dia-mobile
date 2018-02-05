import { Component, Input } from '@angular/core';


@Component({
  selector: 'insights-chart-pie',
  templateUrl: 'insights-chart-pie.html'
})
export class InsightsChartPieComponent {

  @Input() chartData;

  constructor() {
  }


}

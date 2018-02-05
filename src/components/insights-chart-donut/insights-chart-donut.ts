import { Component, Input } from '@angular/core';


@Component({
  selector: 'insights-chart-donut',
  templateUrl: 'insights-chart-donut.html'
})
export class InsightsChartDonutComponent {
  @Input() chartData;

  constructor() {
  }


}

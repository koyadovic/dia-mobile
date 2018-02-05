import { Component, Input } from '@angular/core';

@Component({
  selector: 'insights-chart-columns',
  templateUrl: 'insights-chart-columns.html'
})
export class InsightsChartColumnsComponent {

  @Input() chartData;

  constructor() {
  }

}

import { Component, Input } from '@angular/core';


@Component({
  selector: 'insights-chart-lines',
  templateUrl: 'insights-chart-lines.html'
})
export class InsightsChartLinesComponent {

  @Input() chartData;

  constructor() {
  }


}

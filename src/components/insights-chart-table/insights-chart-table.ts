import { Component, Input } from '@angular/core';


@Component({
  selector: 'insights-chart-table',
  templateUrl: 'insights-chart-table.html'
})
export class InsightsChartTableComponent {
  @Input() tableConcreteData;

  constructor() {}


}

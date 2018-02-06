import { Component, Input } from '@angular/core';


@Component({
  selector: 'insights-chart-key-values',
  templateUrl: 'insights-chart-key-values.html'
})
export class InsightsChartKeyValuesComponent {

  @Input() keyValuesConcreteData;

  constructor() {}


}

import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'insights-chart-columns',
  templateUrl: 'insights-chart-columns.html'
})
export class InsightsChartColumnsComponent {

  @ViewChild('columnsChartCanvas') columnsChartCanvas;
  columnsChart: any;

  @Input() columnsConcreteData = null;

  constructor() {}

  ngOnChanges(changes) {
    if('columnsConcreteData' in changes && !!this.columnsConcreteData) {

      let chartData = {
        type: 'bar',
        data: {
          labels: this.columnsConcreteData["labels"],
          datasets: this.columnsConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label']} })
        },
        options: {
          responsive: false
        }
      };

      this.columnsChart = new Chart(this.columnsChartCanvas.nativeElement, chartData);
    }
  }
}

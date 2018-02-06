import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'insights-chart-donut',
  templateUrl: 'insights-chart-donut.html'
})
export class InsightsChartDonutComponent {
  @ViewChild('donutChartCanvas') donutChartCanvas;

  @Input() donutConcreteData;
  donutChart;

  constructor() {}

  ngOnChanges(changes) {
    if('donutConcreteData' in changes && !!this.donutConcreteData) {

      let chartData = {
        type: 'doughnut',
        data: {
          labels: this.donutConcreteData["labels"],
          datasets: this.donutConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label']} })
        },
        options: {
          responsive: false
        }
      };

      this.donutChart = new Chart(this.donutChartCanvas.nativeElement, chartData);
    }
  }
}

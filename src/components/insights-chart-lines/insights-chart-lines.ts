import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'insights-chart-lines',
  templateUrl: 'insights-chart-lines.html'
})
export class InsightsChartLinesComponent {
  @ViewChild('linesChartCanvas') linesChartCanvas;

  @Input() linesConcreteData;
  linesChart;

  constructor() {}

  ngOnChanges(changes) {
    if('linesConcreteData' in changes && !!this.linesConcreteData) {

      let chartData = {
        type: 'line',
        data: {
          labels: this.linesConcreteData["labels"],
          datasets: this.linesConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label']} })
        },
        options: {
          responsive: false,
          fill: 'start'
        }
      };

      this.linesChart = new Chart(this.linesChartCanvas.nativeElement, chartData);
    }
  }
}

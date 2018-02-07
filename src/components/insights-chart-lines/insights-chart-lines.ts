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
          datasets: this.linesConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label'],
          backgroundColor: [
            'rgba(102,211,255,0.2)',
            'rgba(255,102,211,0.2)',
            'rgba(211,255,102,0.2)',
            'rgba(102,135,255,0.2)',
            'rgba(255,102,135,0.2)',
            'rgba(135,255,102,0.2)'
          ],
          borderColor: [
            'rgba(102,211,255,1)',
            'rgba(255,102,211,1)',
            'rgba(211,255,102,1)',
            'rgba(102,135,255,1)',
            'rgba(255,102,135,1)',
            'rgba(135,255,102,1)'
          ],
          borderWidth: 1
        } })
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

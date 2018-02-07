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
          datasets: this.donutConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label'],
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
          responsive: false
        }
      };

      this.donutChart = new Chart(this.donutChartCanvas.nativeElement, chartData);
    }
  }
}

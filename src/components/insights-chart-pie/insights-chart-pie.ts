import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'insights-chart-pie',
  templateUrl: 'insights-chart-pie.html'
})
export class InsightsChartPieComponent {
  @ViewChild('pieChartCanvas') pieChartCanvas;

  @Input() pieConcreteData;
  pieChart;

  constructor() {}

  ngOnChanges(changes) {
    if('pieConcreteData' in changes && !!this.pieConcreteData) {

      let chartData = {
        type: 'pie',
        data: {
          labels: this.pieConcreteData["labels"],
          datasets: this.pieConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label'],
          backgroundColor: [
            'rgba(102,211,255,0.8)',
            'rgba(255,102,211,0.8)',
            'rgba(211,255,102,0.8)',
            'rgba(102,135,255,0.8)',
            'rgba(255,102,135,0.8)',
            'rgba(135,255,102,0.8)'
          ],
          borderColor: [
            'rgba(102,211,255,1)',
            'rgba(255,102,211,1)',
            'rgba(211,255,102,1)',
            'rgba(102,135,255,1)',
            'rgba(255,102,135,1)',
            'rgba(135,255,102,1)'
          ],
          borderWidth: 2
        } })
        },
        options: {
          responsive: false
        }
      };

      this.pieChart = new Chart(this.pieChartCanvas.nativeElement, chartData);
    }
  }

}

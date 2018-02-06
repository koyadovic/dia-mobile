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
          datasets: this.pieConcreteData["datasets"].map((x) => { return {data: x['data'], label: x['label']} })
        },
        options: {
          responsive: false
        }
      };

      this.pieChart = new Chart(this.pieChartCanvas.nativeElement, chartData);
    }
  }

}

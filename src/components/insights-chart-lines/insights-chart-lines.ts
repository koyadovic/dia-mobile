import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { InsightsChartComponent } from '../insights-chart/insights-chart';

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
          datasets: this.linesConcreteData["datasets"].map((x) => {
            let color = InsightsChartComponent.getCurrentColor('0.8');
            let bgColor = InsightsChartComponent.getCurrentColor('0.2');
            InsightsChartComponent.increaseCurrentColor();
            return {
              data: x['data'],
              label: x['label'],
              backgroundColor: bgColor,
              borderColor: color,
              borderWidth: 2,
            }
          })
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

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
      let xypoints = false;

      let chartData = {
        type: 'line',
        data: {
          labels: this.linesConcreteData["labels"],
          datasets: this.linesConcreteData["datasets"].map((elem) => {
            let color = InsightsChartComponent.getCurrentColor('0.8');
            let bgColor = InsightsChartComponent.getCurrentColor('0.2');
            InsightsChartComponent.increaseCurrentColor();
            xypoints = elem['data'].length > 0 && isNaN(elem['data'][0]) && 'x' in elem['data'][0];
            return {
              data: elem['data'],
              label: elem['label'],
              backgroundColor: bgColor,
              borderColor: color,
              borderWidth: 2,
              lineTension: 0,
            }
          })
        },
        options: {
          responsive: false,
          fill: 'start',
          animation: false,
        }
      };
      if (xypoints) {
          chartData['options']['scales'] = {
            xAxes: [{
               display: true,
               type: 'linear',
            }],
            yAxes: [{
               display: true,
               type: 'linear',
            }]
         }
      }
      this.linesChart = new Chart(this.linesChartCanvas.nativeElement, chartData);
    }
  }
}

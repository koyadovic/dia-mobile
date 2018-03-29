import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { InsightsChartComponent } from '../insights-chart/insights-chart';

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
      let bgColors = [];
      let colors = [];
      let index = 0;

      for (let n = 0; n < this.donutConcreteData["datasets"].length; n ++) {
        for(let j = 0; j < this.donutConcreteData["datasets"][n]["data"].length; j ++) {
          bgColors.push(InsightsChartComponent.getCurrentColor('0.5', index));
          colors.push(InsightsChartComponent.getCurrentColor('0.8', index));
          index ++;
        }
      }

      let chartData = {
        type: 'doughnut',
        data: {
          labels: this.donutConcreteData["labels"],
          datasets: this.donutConcreteData["datasets"].map((x) => {
            return {
              data: x['data'],
              label: x['label'],
              backgroundColor: bgColors,
              borderColor: colors,
              borderWidth: 2
            }
          })
        },
        options: {
          responsive: false,
          animation: false
        }
      };

      this.donutChart = new Chart(this.donutChartCanvas.nativeElement, chartData);
    }
  }
}

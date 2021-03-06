import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { InsightsChartComponent } from '../insights-chart/insights-chart';

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
      let bgColors = [];
      let colors = [];
      let index = 0;

      for (let n = 0; n < this.pieConcreteData["datasets"].length; n ++) {
        for(let j = 0; j < this.pieConcreteData["datasets"][n]["data"].length; j ++) {
          bgColors.push(InsightsChartComponent.getCurrentColor('0.5', index));
          colors.push(InsightsChartComponent.getCurrentColor('0.8', index));
          index ++;
        }
      }

      let chartData = {
        type: 'pie',
        data: {
          labels: this.pieConcreteData["labels"],
          datasets: this.pieConcreteData["datasets"].map(
            (x) => {
              let result = {
                data: x['data'],
                label: x['label'],
                backgroundColor: bgColors,
                borderColor: colors,
                borderWidth: 2
              }
              return result;
          })
        },
        options: {
          responsive: false,
          animation: false
        }
      };

      this.pieChart = new Chart(this.pieChartCanvas.nativeElement, chartData);
    }
  }

}

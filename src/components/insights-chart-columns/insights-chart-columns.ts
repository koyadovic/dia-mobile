import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { InsightsChartComponent } from '../insights-chart/insights-chart';

@Component({
  selector: 'insights-chart-columns',
  templateUrl: 'insights-chart-columns.html'
})
export class InsightsChartColumnsComponent {

  @ViewChild('columnsChartCanvas') columnsChartCanvas;
  columnsChart: any;

  @Input() columnsConcreteData = null;

  constructor() {}

  ngOnChanges(changes) {
    if('columnsConcreteData' in changes && !!this.columnsConcreteData) {

      let chartData = {
        type: 'bar',
        data: {
          labels: this.columnsConcreteData["labels"],
          datasets: this.columnsConcreteData["datasets"].map(
            (x) => {
              let color = InsightsChartComponent.getCurrentColor('0.8');
              let bgColor = InsightsChartComponent.getCurrentColor('0.5');
              InsightsChartComponent.increaseCurrentColor();
              return {
                data: x['data'],
                label: x['label'],
                backgroundColor: bgColor,
                borderColor: color,
                borderWidth: 2
              } 
            }
          )
        },
        options: {
          responsive: false
        }
      };
      this.columnsChart = new Chart(this.columnsChartCanvas.nativeElement, chartData);
    }
  }
}

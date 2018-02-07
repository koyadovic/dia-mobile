import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

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
              return {
                data: x['data'],
                label: x['label'],
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
  currentColor = 0;
  availableColors = [
    'rgba(102,211,255,1)',
    'rgba(255,102,211,1)',
    'rgba(211,255,102,1)',
    'rgba(102,135,255,1)',
    'rgba(255,102,135,1)',
    'rgba(135,255,102,1)'
  ]
  getCurrentColor() {
    let color = this.availableColors[this.currentColor];
    this.currentColor ++;
    return color;
  }
}

import { Component, Input } from '@angular/core';
import { DiaInsightsService } from '../../services/dia-insights-service';

@Component({
  selector: 'insights-chart',
  templateUrl: 'insights-chart.html'
})
export class InsightsChartComponent {

  @Input() chartData;
  @Input() show: boolean = false;
  @Input() loadDelayInSeconds: number = 1;

  private pieConcreteData = null;
  private linesConcreteData = null;
  private columnsConcreteData = null;
  private donutConcreteData = null;
  private tableConcreteData = null;
  private keyValuesConcreteData = null;

  constructor(private insightsService: DiaInsightsService) {
  }

  ngOnChanges(changes) {
    if("chartData" in changes) {
      setTimeout(this.loadChartData.bind(this), this.loadDelayInSeconds * 1000);
    }
  }

  loadChartData() {
    if (!!this.chartData && this.chartData['url']) {
      this.insightsService.getConcreteInsight(this.chartData['url']).subscribe(
        (resp) => {
          switch(resp['type']){
            case 'pie':
            this.pieConcreteData = resp;
            break;
            case 'lines':
            this.linesConcreteData = resp;
            break;
            case 'columns':
            this.columnsConcreteData = resp;
            break;
            case 'donut':
            this.donutConcreteData = resp;
            break;
            case 'table':
            this.tableConcreteData = resp;
            break;
            case 'key-values':
            this.keyValuesConcreteData = resp;
            break;
          }
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

}

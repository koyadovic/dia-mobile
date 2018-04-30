import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';
import { DiaInsightsService } from '../../services/dia-insights-service';
import { Content } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DiaMessage } from '../../models/messages-model';
import { DiaMessageService } from '../../services/dia-message-service';


@Component({
  selector: 'tab-insights',
  templateUrl: 'insights.html',
})
export class InsightsPage {
  @ViewChild(Content) content: Content;

  insightsData = []
  activeInsightSegment:string = '';
  activeInsightSegmentChartData: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translate: TranslateService,
              public toastCtrl: ToastController,
              public events: Events,
              public loadingCtrl: LoadingController,
              private messageService: DiaMessageService,
              private insightsService: DiaInsightsService) {

    this.refreshInsights();

    // if there are changes in medications, we need to reload insights
    this.events.subscribe('medications:medications-change', () =>  {
      this.refreshInsights();
    });

    this.events.subscribe('traits:body-trait-change', () => {
      console.log('received');
      this.refreshInsights();
    });
  }

  refreshInsights() {
    this.insightsService.getInsights().subscribe(
      (resp) => {
        this.insightsData = resp;
        if(this.insightsData.length > 0) {
          this.activeInsightSegment = this.insightsData[0]['title'];
          this.activeInsightSegmentChartData = this.insightsData[0]['insights'];
        }
      }
    );
  }

  ionViewWillLeave() {
    this.content.scrollToTop();
  }

  resize() {
    this.content.resize();
  }

  tabChanged(segment){
    this.content.scrollToTop();
    this.activeInsightSegment = segment['title'];
    this.activeInsightSegmentChartData = segment['insights'];
  }

  generateReport() {
    forkJoin(
      this.translate.get('Request Report'),
      this.translate.get('This will generate a PDF file with all the information shown here, in insights page and will send it to your email. Proceed?'),
    ).subscribe(([title, message]) => {

      let diaMessage = new DiaMessage(title, null, message);
      this.messageService.confirmMessage(diaMessage).subscribe(
        (ok) => {
          if(ok) {
            this.translate.get('Generating Report ...').subscribe(
              generatingMessage => {
                let loading = this.loadingCtrl.create({
                  content: generatingMessage
                });
                loading.present();

                this.insightsService.requestReport().subscribe(
                  (resp) => {
                    loading.dismiss();
                    this.translate.get('Report was sent to your email address. Check your mailbox!').subscribe(
                      message => {
                        this.toastMessage(message);
                      }
                    );
                  },
                  (err) => {
                    loading.dismiss();

                    if(err.status === 405) {
                      this.translate.get('Sorry but only report per day can be requested').subscribe(
                        message => {
                          this.toastMessage(message);
                        }
                      );
                    } else {
                      console.error(err);
                    }
                  }
                );
    
              }
            );

          }
        },
        (err) => {
          console.error(err);
        }
      );
    });

  }

  private toastMessage(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
}

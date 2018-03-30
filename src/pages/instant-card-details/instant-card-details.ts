import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-instant-card-details',
  templateUrl: 'instant-card-details.html',
})
export class InstantCardDetailsPage {
  instantCard;

  activity_intensities = {
    "1": "Soft",
    "2": "Medium",
    "3": "High",
    "4": "Extreme",
  };

  trait_types = {
    "2": "Height",
    "3": "Weight",
    "4": "Neck Perimeter",
    "5": "Abdomen Perimeter",
    "6": "Waist Perimeter",
  };

  trait_types_measure = {
      "2": "cm",
      "3": "kg",
      "4": "cm",
      "5": "cm",
      "6": "cm",
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              private translate: TranslateService,
              private alertCtrl: AlertController) {

    this.instantCard = this.navParams.get("instantCard");
  }


  closeWithRefresh() {
    this.viewCtrl.dismiss({"refresh": true, "deletedID": this.instantCard.id});
  }
  deleteInstant() {
    forkJoin(
      this.translate.get('Confirm delete'),
      this.translate.get('Do you really want to eliminate this instant?'),
      this.translate.get('Cancel'),
      this.translate.get('Delete'),
    ).subscribe(([title, mess, cancelText, deleteText]) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: mess,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: deleteText,
            handler: () => {
              // eliminarlo
              this.timelineService.deleteInstant(this.instantCard.id, this.instantCard.signature).subscribe(
                (resp) => {
                  this.closeWithRefresh();
                },
                (err) => {
                  console.error(err);
                }
              );
            }
          }
        ]
      });
      alert.present();
    });
  }

  closeWithoutRefresh() {
    this.viewCtrl.dismiss({"refresh": false});
  }

  /* For text formating */
  upper(text: string) {
    return text.replace(/^(\w)/, s => s.toUpperCase());
  }

  lower(text: string) {
    return text.toLowerCase();
  }

  round(n: number, decimals?:number){
    if (decimals !== undefined) {
      return Math.round(n * 10 * decimals) / 10 * decimals;
    }
    return Math.round(n);
  }
}

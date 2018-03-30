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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService,
              private translate: TranslateService,
              private alertCtrl: AlertController) {

    this.instantCard = this.navParams.get("instantCard");
    console.log(this.instantCard);
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
}

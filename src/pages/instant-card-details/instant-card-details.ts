import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DiaTimelineService } from '../../services/dia-timeline-service';


@Component({
  selector: 'page-instant-card-details',
  templateUrl: 'instant-card-details.html',
})
export class InstantCardDetailsPage {
  instantCard;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private timelineService: DiaTimelineService) {

    this.instantCard = this.navParams.get("instantCard");
    console.log(this.instantCard);
  }


  closeWithRefresh() {
    this.viewCtrl.dismiss({"refresh": true, "deletedID": this.instantCard.id});
  }
  deleteInstant() {
    // eliminarlo
    this.timelineService.deleteInstant(this.instantCard.id).subscribe(
      (resp) => {
        this.closeWithRefresh();
      },
      (err) => {
        console.error(err);
      }
    );
    
  }

  closeWithoutRefresh() {
    this.viewCtrl.dismiss({"refresh": false});
  }
}

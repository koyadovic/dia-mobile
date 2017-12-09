import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlucoseLevel } from '../../models/glucose-model';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-add-glucose',
  templateUrl: 'add-glucose.html',
})
export class AddGlucosePage {
  private glucose:GlucoseLevel;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private timelineService: DiaTimelineService,
    private viewCtrl: ViewController) {

    this.glucose = { id: 0, instant: 0, level: null };
  }

  ionViewDidLoad() {
  }

  addGlucose() {
    this.timelineService.addGlucose(this.glucose).subscribe(
      (resp) => {
        // fuck yeah!
        this.navCtrl.pop();
      },
      (err) => {
        // ouch!
      }
    )
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
}

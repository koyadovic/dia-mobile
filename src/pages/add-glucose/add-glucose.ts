import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlucoseLevel } from '../../models/glucose-model';
import { DiaTimelineService } from '../../services/dia-timeline-service';

@IonicPage()
@Component({
  selector: 'page-add-glucose',
  templateUrl: 'add-glucose.html',
})
export class AddGlucosePage {
  private glucose:GlucoseLevel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private timelineService: DiaTimelineService) {

    this.glucose = { id: 0, instant: 0, level: null };

  }

  ionViewDidLoad() {
  }

  addGlucose() {

  }

}

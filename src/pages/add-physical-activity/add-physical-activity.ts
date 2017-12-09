import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the AddPhysicalActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-physical-activity',
  templateUrl: 'add-physical-activity.html',
})
export class AddPhysicalActivityPage {
  public intensities = [
    { value: 1, name: 'Soft walk' },
    { value: 2, name: 'Heavy walk' },
    { value: 3, name: 'Run, weightlifting' },
    { value: 4, name: 'Sprints, HIIT' },
  ]

  private activity;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private timelineService: DiaTimelineService,
    private viewCtrl: ViewController) {
    
    this.activity = {
      intensity: 1,
      minutes: 0
    }
  }

  ionViewDidLoad() {
  }


  addActivity() {
    this.timelineService.addPhysicalActivity(this.activity).subscribe(
      (resp) => {
        this.viewCtrl.dismiss({"add": true})
      },
      (err) => {
      }
    )
  }

}

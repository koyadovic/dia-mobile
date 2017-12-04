import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimeLinePage {

  constructor(public navCtrl: NavController) {

  }


  /*
  For Swipe gesture
  */

  goRight() {
    console.log("Right");
  }

  goLeft() {
    console.log("Left");
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-initial-configuration',
  templateUrl: 'initial-configuration.html',
})
export class InitialConfigurationPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitialConfigurationPage');
  }

  finished() {
    // here we save the configuration and window.location.href = '/';
    window.location.href = '/';
  }

}

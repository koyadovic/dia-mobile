import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MainPage } from '../main/main';
import { App } from 'ionic-angular/components/app/app';
import { ConfigurationPage } from '../configuration/configuration';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  private rootPage =  MainPage;
  private selectedIndex: number = 0;

  constructor(public navCtrl: NavController,
              private appCtrl: App,
              public menuCtrl: MenuController,
              public navParams: NavParams,
              public events: Events) {

    this.events.subscribe('response:change:tab', (index) => {
      this.selectedIndex = index;
    });

  }


  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }

  eventGoTab(index: number){
    this.events.publish('request:change:tab', index);
  }
}

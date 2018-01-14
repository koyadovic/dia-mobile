import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MainPage } from '../main/main';
import { App } from 'ionic-angular/components/app/app';
import { ConfigurationPage } from '../configuration/configuration';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  private rootPage =  MainPage;

  constructor(public navCtrl: NavController,
              private appCtrl: App,
              public menuCtrl: MenuController,
              public navParams: NavParams) {}


  goConfiguration() {
    this.appCtrl.getRootNavs()[0].push(ConfigurationPage);
  }
            
}

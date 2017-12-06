import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { TimeLinePage } from '../timeline/timeline';
import { ConfigurationPage } from '../configuration/configuration';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = TimeLinePage;
  tab3Root = ConfigurationPage;

  constructor() {}
  
}

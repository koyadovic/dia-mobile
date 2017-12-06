import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { TimeLinePage } from '../timeline/timeline';
import { ConfigurationPage } from '../configuration/configuration';
import { DiaConfigurationService } from '../../services/dia-configuration-service';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  //configuration$ = null;

  tab1Root = HomePage;
  tab2Root = TimeLinePage;
  tab3Root = ConfigurationPage;

  constructor(private configurationService: DiaConfigurationService) {
    //this.configuration$ = this.configurationService.getConfiguration();
  }
}

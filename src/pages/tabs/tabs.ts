import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { TimeLinePage } from '../timeline/timeline';
import { ConfigurationPage } from '../configuration/configuration';
import { RestBackendService } from '../../providers/rest-backend-service/rest-backend-service';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  configuration = null;

  tab1Root = HomePage;
  tab2Root = TimeLinePage;
  tab3Root = ConfigurationPage;

  constructor(
    private restService: RestBackendService
  ) {
    this.configuration = this.restService.configuration;
  }
}

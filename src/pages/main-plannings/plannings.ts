import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';
import { DiaPlanningsService } from '../../services/dia-plannings-service';
import { Planning } from '../../models/plannings-model';

@Component({
  selector: 'tab-plannings',
  templateUrl: 'plannings.html',
})
export class PlanningsPage {

  plannings: Planning[] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              private planningsService: DiaPlanningsService) {

    this.planningsService.getPlannings().subscribe(
      plannings => this.plannings = plannings
    );
  }
}

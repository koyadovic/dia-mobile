import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';
import { DiaPlanningsService } from '../../services/dia-plannings-service';
import { Planning } from '../../models/plannings-model';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PlanningsEditorPage } from '../plannings-editor/plannings-editor';

@Component({
  selector: 'tab-plannings',
  templateUrl: 'plannings.html',
})
export class PlanningsPage {

  plannings: Planning[] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              private planningsService: DiaPlanningsService,
              private modalCtrl: ModalController) {

    this.refresh();
  }

  savePlanning(planning) {
    let req;
    if(planning.id !== null){
      req = this.planningsService.modifyPlanning(planning.id, planning);
    } else {
      req = this.planningsService.savePlanning(planning);
    }
    req.subscribe((resp) => this.refresh, (err) => console.log(err));
  }

  editPlanning(planning){
    let modal = this.modalCtrl.create(PlanningsEditorPage, {planning: planning});

    modal.onDidDismiss((result) => {
      if(!!result && 'refresh' in Object.keys(result) && result['refresh']) {
        this.refresh();
      }
    });
    modal.present();
  }

  deletePlanning(planning) {
    this.planningsService.deletePlanning(planning.id).subscribe(
      (resp) => {
        this.refresh();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  refresh() {
    this.planningsService.getPlannings().subscribe(
      plannings => this.plannings = plannings
    );
  }
}

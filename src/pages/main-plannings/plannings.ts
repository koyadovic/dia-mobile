import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigurationPage } from '../configuration/configuration';
import { TranslateService } from '@ngx-translate/core';
import { DiaPlanningsService } from '../../services/dia-plannings-service';
import { Planning } from '../../models/plannings-model';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PlanningsEditorPage } from '../plannings-editor/plannings-editor';
import { DiaMessage } from '../../models/messages-model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DiaMessageService } from '../../services/dia-message-service';

@Component({
  selector: 'tab-plannings',
  templateUrl: 'plannings.html',
})
export class PlanningsPage {

  plannings: Planning[] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private translate: TranslateService,
              private messageService: DiaMessageService,
              private planningsService: DiaPlanningsService,
              private modalCtrl: ModalController,
              private events: Events) {

    this.refresh();
  }

  savePlanning(planning) {
    let req;
    if(planning.id !== null){
      req = this.planningsService.modifyPlanning(planning.id, planning);
    } else {
      req = this.planningsService.savePlanning(planning);
    }
    req.subscribe(
      (resp) =>  {
        this.refresh;
        this.events.publish('timeline:with:changes');
      },
      (err) => console.error(err)
    );
  }

  editPlanning(planning){
    let modal = this.modalCtrl.create(PlanningsEditorPage, {planning: planning});

    modal.onDidDismiss((result) => {
      if(!!result && 'refresh' in result && result['refresh']) {
        this.events.publish('timeline:with:changes');
        this.refresh();
      }
    });
    
    modal.present();
  }

  deletePlanning(planning) {
    forkJoin(
      this.translate.get("Delete Planning?"),
      this.translate.get("Are you sure to delete this planning?")
    ).subscribe(([title, message]) => {
      let diamessage = new DiaMessage(title, "info", message)
      this.messageService.confirmMessage(diamessage).subscribe((ok) => {
        // if we have confirmation, delete the planning
        if (ok) {
          this.planningsService.deletePlanning(planning.id).subscribe(
            (resp) => {
              this.events.publish('timeline:with:changes');
              this.refresh();
            },
            (err) => {
              console.error(err);
            }
          );
        }
      });
    });
  }

  refresh() {
    this.planningsService.getPlannings().subscribe(
      plannings => this.plannings = plannings
    );
  }
}

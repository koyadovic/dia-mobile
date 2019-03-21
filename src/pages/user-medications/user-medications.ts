import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Medication } from '../../models/medications-model';
import { DiaMedicationsService } from '../../services/dia-medications-service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { DiaMessageService } from '../../services/dia-message-service';
import { DiaMessage } from '../../models/messages-model';


@Component({
  selector: 'page-user-medications',
  templateUrl: 'user-medications.html',
})
export class UserMedicationsPage {

  private userMedications: Medication[] = [];
  private searchMedicationsResult: Medication[] = [];
  private searchString = '';

  private searching: boolean = false;
  private viewStatusString = '';

  // this is for the page closing. If was changes, global user medications needs to be refreshed.
  public static hadChanges:boolean = false;

  // status messages
  noMedications:string = 'Currently you don\'t have medications added. Try searching!';
  yesMedications:string = 'Your currently added medications. If you want, you can search for new ones';
  noResults:string = 'There is no results ... Try with another name';
  thereIs = 'There is';
  thereAre = 'There are';
  textResult = 'result';
  textResults = 'results';
  statusError = `I seems that there was an error ... Sorry!`;

  // toast messages
  toastMedicationAdded = 'Medication added correctly to your list';
  toastMedicationError = 'There seem to was an error';
  toastRemoved = 'Medication removed correctly from your list';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private translate: TranslateService,
              private timelineService: DiaTimelineService,
              private messageService: DiaMessageService,
              public medicationsService: DiaMedicationsService) {

    this.translateStrings();
  }

  ionViewDidLoad() {
    UserMedicationsPage.hadChanges = false;

    this.medicationsService.getUserMedications().subscribe(
      (medications) => {
        this.userMedications = medications;
        if(this.userMedications.length === 0) {
          this.viewStatusString = this.noMedications;
        } else {
          this.viewStatusString = this.yesMedications;
        }
      }
    );
  }

  onInput(event) {
    this.searchString = event.target.value;

    if(this.searchString !== '' && !!this.searchString) {
      this.searching = true;

      this.medicationsService.searchMedications(this.searchString).subscribe(
        (medications) => {
          this.searchMedicationsResult = medications;
          this.searching = false;
          if(this.searchMedicationsResult.length === 0) {
            this.viewStatusString = this.noResults;
          } else {
            if (this.searchMedicationsResult.length === 1) {
              this.viewStatusString = `${this.thereIs} ${this.searchMedicationsResult.length} ${this.textResult}.`;
            } else {
              this.viewStatusString = `${this.thereAre} ${this.searchMedicationsResult.length} ${this.textResults}.`;
            }
            
          }
          
        },
        (err) => {
          this.searching = false;
          console.error(err);
          this.viewStatusString = this.statusError;
        }
      );
    } else {
      this.searchString = '';
      this.searchMedicationsResult = [];
      if(this.userMedications.length === 0) {
        this.viewStatusString = this.noMedications;
      } else {
        this.viewStatusString = this.yesMedications;
      }
    
    }
  }

  addMedication(id: number) {
    forkJoin(
      this.translate.get('Need confirmation'),
      this.translate.get('Add this medication?'),
    ).subscribe(([title, message]) => {

      let diaMessage = new DiaMessage(title, null, message);
      this.messageService.confirmMessage(diaMessage).subscribe(
        (ok) => {
          if(ok) {
            this.medicationsService.addUserMedication(id).subscribe(
              (resp) => {
                // remove from one array and push it to the other
                let index = this.indexOfID(id, this.searchMedicationsResult);
                let medication = this.searchMedicationsResult[index];
                this.searchMedicationsResult.splice(index, 1);
                this.userMedications.push(medication);

                this.searchString = '';
                this.searchMedicationsResult = [];
                if(this.userMedications.length === 0) {
                  this.viewStatusString = this.noMedications;
                } else {
                  this.viewStatusString = this.yesMedications;
                }

                this.toastMessage(this.toastMedicationAdded);
                UserMedicationsPage.hadChanges = true;
                this.timelineService.refreshElementFields();
              },
              (err) => {
                this.toastMessage(this.toastMedicationError);
                console.error(err);
              }
            );
          }

        },
        (err) => {
          console.error(err);
        }
      );
    })

  }

  removeMedication(item, id: number) {
    item.close();

    this.medicationsService.removeUserMedication(id).subscribe(
      (resp) => {
        // remove from one array and push it to the other
        let index = this.indexOfID(id, this.userMedications);
        let medication = this.userMedications[index];
        this.userMedications.splice(index, 1);
        this.searchMedicationsResult.push(medication);

        this.toastMessage(this.toastRemoved);
        UserMedicationsPage.hadChanges = true;

        this.timelineService.refreshElementFields();

        // for the message
        if(this.userMedications.length === 0) {
          this.viewStatusString = this.noMedications;
        } else {
          this.viewStatusString = this.yesMedications;
        }
  
      },
      (err) => {
        this.toastMessage(this.toastMedicationError);
        console.error(err);
      }
    );
  }

  toastMessage(message:string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

  private indexOfID(id:number, array) {
    for(let elem of array) {
      if (elem['id'] == id) {
        return array.indexOf(elem);
      }
    }
    return -1;
  }

  private translateStrings() {
    forkJoin(
      this.translate.get(this.noMedications),
      this.translate.get(this.yesMedications),
      this.translate.get(this.noResults),
      this.translate.get(this.thereIs),
      this.translate.get(this.thereAre),
      this.translate.get(this.textResult),
      this.translate.get(this.textResults),
      this.translate.get(this.statusError),
      this.translate.get(this.toastMedicationAdded),
      this.translate.get(this.toastMedicationError),
      this.translate.get(this.toastRemoved),
    ).subscribe(([noMedications, yesMedications, noResults, thereIs, thereAre, textResult, textResults,
      statusError, toastMedicationAdded, toastMedicationError, toastRemoved]) => {
        this.noMedications = noMedications;
        this.yesMedications = yesMedications;
        this.noResults = noResults;
        this.thereIs = thereIs;
        this.thereAre = thereAre;
        this.textResult = textResult;
        this.textResults = textResults;
        this.statusError = statusError;
        this.toastMedicationAdded = toastMedicationAdded;
        this.toastMedicationError = toastMedicationError;
        this.toastRemoved = toastRemoved;
    });
  }

  /* For text formating */
  upper(text: string) {
    return text.replace(/^(\w)/, s => s.toUpperCase());
  }
}

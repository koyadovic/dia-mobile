import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Medication } from '../../models/medications-model';
import { DiaMedicationsService } from '../../services/dia-medications-service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public medicationsService: DiaMedicationsService) {}

  ionViewDidLoad() {
    UserMedicationsPage.hadChanges = false;

    this.medicationsService.getUserMedications().subscribe(
      (medications) => {
        this.userMedications = medications;
        if(this.userMedications.length === 0) {
          this.viewStatusString = 'Currently you don\'t have medications added. Try searching!';
        } else {
          this.viewStatusString = 'Your currently added medications. If you want, you can search for new ones.';
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
            this.viewStatusString = 'There is no results ... Try with another name.';
          } else {
            if (this.searchMedicationsResult.length === 1) {
              this.viewStatusString = `There is ${this.searchMedicationsResult.length} result.`;
            } else {
              this.viewStatusString = `There are ${this.searchMedicationsResult.length} results.`;
            }
            
          }
          
        },
        (err) => {
          this.searching = false;
          console.error(err);
          this.viewStatusString = `I seems that there was an error ... Sorry!`;
        }
      );
    } else {
      this.searchString = '';
      this.searchMedicationsResult = [];
      if(this.userMedications.length === 0) {
        this.viewStatusString = 'Currently you don\'t have medications added. Try searching!';
      } else {
        this.viewStatusString = 'Your currently added medications. If you want, you can search for new ones.';
      }
    
    }
  }

  addMedication(item, id: number) {
    item.close();

    this.medicationsService.addUserMedication(id).subscribe(
      (resp) => {
        // remove from one array and push it to the other
        let index = this.indexOfID(id, this.searchMedicationsResult);
        let medication = this.searchMedicationsResult[index];
        this.searchMedicationsResult.splice(index, 1);
        this.userMedications.push(medication);

        this.toastMessage('Medication added correctly to your list');
        UserMedicationsPage.hadChanges = true;
      },
      (err) => {
        this.toastMessage('There seem to was an error.');
        console.error(err);
      }
    );
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

        this.toastMessage('Medication removed correctly from your list');
        UserMedicationsPage.hadChanges = true;

        // for the message
        if(this.userMedications.length === 0) {
          this.viewStatusString = 'Currently you don\'t have medications added. Try searching!';
        } else {
          this.viewStatusString = 'Your currently added medications. If you want, you can search for new ones.';
        }
  
      },
      (err) => {
        this.toastMessage('There seem to was an error.');
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
}

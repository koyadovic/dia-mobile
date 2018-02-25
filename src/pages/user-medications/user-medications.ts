import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Medication } from '../../models/medications-model';
import { DiaMedicationsService } from '../../services/dia-medications-service';


@Component({
  selector: 'page-user-medications',
  templateUrl: 'user-medications.html',
})
export class UserMedicationsPage {
  /*
  En el inicio, que se consulten las del usuario. Si hay, que te salga el listado.

  Si un usuario busca en el cuadro de texto, se busca en el backend por nombre y se muestran los resultados. Si se elimina la búsqueda
  vuelve a salir la lista de medicamentos del usuario
  */

  private userMedications: Medication[] = [];
  private searchMedicationsResult: Medication[] = [];
  private searchString = '';

  private searching: boolean = false;
  private viewStatusString = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public medicationsService: DiaMedicationsService) {}

  ionViewDidLoad() {
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
}

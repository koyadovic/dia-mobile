import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodSelected, selection_kcal } from '../../models/food-model';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import { forkJoin } from 'rxjs/observable/forkJoin';

/**
 * Generated class for the FoodSummaryComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'food-summary',
  templateUrl: 'food-summary.html'
})
export class FoodSummaryComponent {
  @Input() foodSelected: FoodSelected[] = [];
  @Output() addFeeding: EventEmitter<any> = new EventEmitter();

  @Input() maxCarb = null;
  @Input() maxProt = null;
  @Input() maxFats = null;
  @Input() maxFibe = null;
  @Input() maxAlco = null;
  @Input() maxKcal = null;

  public total_carb_g = 0.0;
  public total_protein_g = 0.0;
  public total_fat_g = 0.0;
  public total_fiber_g = 0.0;
  public total_alcohol_g = 0.0;
  public total_kcal = 0.0;

  constructor(private translate: TranslateService,
              public toastCtrl: ToastController) {}
  
  toast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  ngOnChanges(changes) {
    if('foodSelected' in changes) {
      this.recalculateTotals();
    }
  }

  recalculateTotals() {
    let total_carb_g = 0.0;
    let total_protein_g = 0.0;
    let total_fat_g = 0.0;
    let total_fiber_g = 0.0;
    let total_alcohol_g = 0.0;
    let total_kcal = 0.0;

    for (let food of this.foodSelected) {
      total_carb_g += food.carb_g;
      total_protein_g += food.protein_g;
      total_fat_g += food.fat_g;
      total_fiber_g += food.fiber_g;
      total_alcohol_g += food.alcohol_g;
      total_kcal += selection_kcal(food);
    }

    this.total_carb_g = this.round(total_carb_g);
    this.total_protein_g = this.round(total_protein_g);
    this.total_fat_g = this.round(total_fat_g);
    this.total_fiber_g = this.round(total_fiber_g);
    this.total_alcohol_g = this.round(total_alcohol_g);
    this.total_kcal = this.round(total_kcal);

    this.checkLimits();
  }

  // useful for templates. Maybe we can code a pipe for this
  round(n: number){ return Math.round(n * 10.) / 10.; }

  finishFeedingRequested() {
    this.addFeeding.emit();
  }

  checkLimits() {
    let delay = 2000;
    if(this.carbsOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The carbohydrate limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxCarb}g ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }

    if(this.proteinsOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The protein limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxProt}g ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }

    if(this.fatsOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The fats limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxFats}g ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }

    if(this.fiberOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The fiber limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxFibe}g ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }

    if(this.alcoholOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The alcohol limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxAlco}g ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }

    if(this.kcalsOverpassed()) {
      setTimeout(() => {
        forkJoin(
          this.translate.get('Warning! The kcal limit'),
          this.translate.get('has been overpassed'),
        ).subscribe(([limitText, overpassed]) => {
          this.toast(limitText + ` ${this.maxKcal} ` + overpassed);
        });
      }, delay);
      delay += 2000;
    }
  }

  carbsOverpassed() {return this.maxCarb !== null && this.maxCarb !== 0 && this.total_carb_g > this.maxCarb;}
  proteinsOverpassed() {return this.maxProt !== null && this.maxProt !== 0 && this.total_protein_g > this.maxProt;}
  fatsOverpassed() {return this.maxFats !== null && this.maxFats !== 0 && this.total_fat_g > this.maxFats;}
  fiberOverpassed() {return this.maxFibe !== null && this.maxFibe !== 0 && this.total_fiber_g > this.maxFibe;}
  alcoholOverpassed() {return this.maxAlco !== null && this.maxAlco !== 0 && this.total_alcohol_g > this.maxAlco;}
  kcalsOverpassed() {return this.maxKcal !== null && this.maxKcal !== 0 && this.total_kcal > this.maxKcal;}
}

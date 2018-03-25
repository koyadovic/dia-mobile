import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodSelected, selection_kcal } from '../../models/food-model';
import { TranslateService } from '@ngx-translate/core';

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

  private total_carb_g = 0.0;
  private total_protein_g = 0.0;
  private total_fat_g = 0.0;
  private total_fiber_g = 0.0;
  private total_alcohol_g = 0.0;
  private total_kcal = 0.0;

  constructor(private translate: TranslateService,) {}

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
  }

  // useful for templates. Maybe we can code a pipe for this
  round(n: number){ return Math.round(n * 10.) / 10.; }

  finishFeedingRequested() {
    this.addFeeding.emit();
  }
}

import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FoodDetailable, FoodSelected, weight, selection_kcal } from '../../models/food-model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'food-selection',
  templateUrl: 'food-selection.html'
})
export class FoodSelectionComponent {
  /*
  This component is for food selections. After food clicked, it's openned a dialog prompting for units or weight.
  This is the component for this dialog
  */
  @Input() food: FoodSelected;
  @Output() selectionFinished:EventEmitter<FoodSelected> = new EventEmitter<FoodSelected>();

  constructor(private translate: TranslateService,) {
  }

  valid() {
    return this.food.selection > 0.0;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  weight() {
    return weight(this.food);
  }

  kcal() {
    return selection_kcal(this.food);
  }

  finishSelection() {
    // select is ok
    let food = JSON.parse(JSON.stringify(this.food));
    this.selectionFinished.emit(food);
  }

  closeSelection() {
    // close without selection
    this.selectionFinished.emit(null);
  }

  updateValues() {
    if(!!this.food.selection) {
      let w = weight(this.food);

      this.food.carb_g = w * this.food.food.carb_factor;
      this.food.protein_g = w * this.food.food.protein_factor;
      this.food.fat_g = w * this.food.food.fat_factor;
      this.food.fiber_g = w * this.food.food.fiber_factor;
      this.food.alcohol_g = w * this.food.food.alcohol_factor;
    } else {
      this.food.carb_g = 0;
      this.food.protein_g = 0;
      this.food.fat_g = 0;
      this.food.fiber_g = 0;
      this.food.alcohol_g = 0;
    }
  }
}

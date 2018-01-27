import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FoodDetailable, FoodSelected, weight, selection_kcal } from '../../models/food-model';


@Component({
  selector: 'food-selection',
  templateUrl: 'food-selection.html'
})
export class FoodSelectionComponent {
  @Input() food: FoodSelected;
  @Output() selectionFinished:EventEmitter<FoodSelected> = new EventEmitter<FoodSelected>();

  constructor() {
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
}

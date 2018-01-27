import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FoodDetailable, FoodSelected, weight } from '../../models/food-model';


@Component({
  selector: 'food-selection',
  templateUrl: 'food-selection.html'
})
export class FoodSelectionComponent {
  @Input() food: FoodDetailable;
  @Output() selectionFinished:EventEmitter<any> = new EventEmitter<any>();
  private foodSelected: FoodSelected

  constructor() {
    this.foodSelected = {
      food: null,
      carb_g: 0.0,
      protein_g: 0.0,
      fat_g: 0.0,
      fiber_g: 0.0,
      alcohol_g: 0.0,
      selection: 0.0
    };
  }

  ngOnChanges(changes) {
    if('food' in changes) {
      this.foodSelected.food = this.food;
    }
  }

  valid() {
    return this.foodSelected.selection > 0.0;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  weight() {
    return weight(this.foodSelected);
  }

  select() {
    let food = JSON.parse(JSON.stringify(this.foodSelected));
    this.selectionFinished.emit(food);
  }

  changeSelection(newSelection: number) {

    if(this.foodSelected.food.g_or_ml_per_unit > 0.0) {

    }
  }

  closeSelection() {
    this.selectionFinished.emit(null);
  }
}

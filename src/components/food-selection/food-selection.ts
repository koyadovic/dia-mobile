import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'food-selection',
  templateUrl: 'food-selection.html'
})
export class FoodSelectionComponent {
  @Input() food;
  @Output() selectionFinished:EventEmitter<any> = new EventEmitter<any>();

  private units:boolean = null;

  @Input() currentlySelected: boolean;

  constructor() {}

  ngOnChanges(changes) {
    if("food" in changes && this.units === null) {
      if(!this.food.g_or_ml_selected)
        this.food.g_or_ml_selected = null;
      if(!this.food.units_selected)
        this.food.units_selected = null;
      
      this.units = this.food.g_or_ml_per_unit > 0;
    }
  }

  kcal(){
    let f = this.food;
    let weight = this.weight();
    return this.round((+f.carb_factor * weight * 4.) + (+f.protein_factor * weight * 4.) + (+f.fat_factor * weight * 9.) + (+f.alcohol_factor * weight * 7.));
  }

  valid() {
    return this.food.g_or_ml_selected > 0.0 || this.food.units_selected > 0.0;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  weight() {
    let f = this.food;
    let weight;
    if(this.units) {
      if(!f.units_selected) {
        weight = 0.0;
      } else {
        weight = +f.units_selected * f.g_or_ml_per_unit;
      }
    } else {
      if(!f.g_or_ml_selected) {
        weight = 0.0;
      } else {
        weight = +f.g_or_ml_selected;
      }
      
    }
    return weight;
  }

  select() {
    if(!this.currentlySelected) {
      let food = JSON.parse(JSON.stringify(this.food));
      this.food.g_or_ml_selected = null;
      this.food.units_selected = null;
      this.selectionFinished.emit(food);
    } else {
      this.selectionFinished.emit(null);
    }
  }

  closeSelection() {
    this.selectionFinished.emit(null);
  }
}

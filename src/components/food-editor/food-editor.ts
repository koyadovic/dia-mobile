import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodSelectable, Food, DiaFood } from '../../models/food-model';

@Component({
  selector: 'food-editor',
  templateUrl: 'food-editor.html',
})
export class FoodEditorComponent {
  @Input() food: DiaFood;
  @Output() editFinished:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  save() {
    this.editFinished.emit(true);
  }

  dismiss() {
    this.editFinished.emit(false);
  }

  valid(){
    let f = this.food;
    if(f.name === "" || f.manufacturer === "") return false;
    if(+f.g_or_ml < +f.carb_g + +f.protein_g + +f.fat_g + +f.fiber_g + +f.alcohol_g) return false;
    if(f.carb_g === null || f.protein_g === null || f.fat_g === null) return false;
    return true;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }
}

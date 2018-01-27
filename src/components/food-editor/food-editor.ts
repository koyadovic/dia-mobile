import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiaFood } from '../../models/food-model';

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
    if((f.carb_factor + f.protein_factor + f.fat_factor + f.fiber_factor + f.alcohol_factor) > 1.0) return false;
    if(f.carb_factor === null || f.protein_factor === null || f.fat_factor === null) return false;
    return true;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }
}

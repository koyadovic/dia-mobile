import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'food-editor',
  templateUrl: 'food-editor.html',
})
export class FoodEditorComponent {
  @Input() food;
  @Output() editFinished:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {

  }

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

  kcal(){
    let f = this.food;
    return this.round((+f.carb_g * 4.) + (+f.protein_g * 4.) + (+f.fat_g * 9.) + (+f.alcohol_g * 7.));
  }
}

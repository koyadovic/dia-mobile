import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiaFood } from '../../models/food-model';

@Component({
  selector: 'food-editor',
  templateUrl: 'food-editor.html',
})
export class FoodEditorComponent {
  @Input() food: DiaFood;
  @Output() editFinished:EventEmitter<boolean> = new EventEmitter<boolean>();

  // new food as the template understands
  private templateFood = {
    name: "",
    manufacturer: "",
    g_or_ml: null,
    g_or_ml_per_unit: null,
    carb_g: null,
    protein_g: null,
    fat_g: null,
    fiber_g: null,
    alcohol_g: null
  }
  constructor() {}

  ngOnChanges(changes) {
    if('food' in changes) {
      this.templateFood = {
        name: this.food.name,
        manufacturer: this.food.manufacturer,
        g_or_ml: "100.0",
        g_or_ml_per_unit: this.food.g_or_ml_per_unit,
        carb_g: this.food.carb_factor * 100.,
        protein_g: this.food.protein_factor * 100.,
        fat_g: this.food.fat_factor * 100.,
        fiber_g: this.food.fiber_factor * 100.,
        alcohol_g: this.food.alcohol_factor * 100.
      }
    }
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
    if((f.carb_factor + f.protein_factor + f.fat_factor + f.fiber_factor + f.alcohol_factor) > 1.0) return false;
    if(f.carb_factor === null || f.protein_factor === null || f.fat_factor === null) return false;
    return true;
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  // This method translate food as the template understands it to the interface understood by dia backend
  updateValues() {
    this.food.name = this.templateFood.name;
    this.food.manufacturer = this.templateFood.manufacturer;
    this.food.g_or_ml_per_unit = this.templateFood.g_or_ml_per_unit !== null ? +this.templateFood.g_or_ml_per_unit : 0.0;
    if (this.templateFood.g_or_ml !== null) {
      this.food.carb_factor = this.templateFood.carb_g !== null ? +this.templateFood.carb_g / +this.templateFood.g_or_ml : 0.0;
      this.food.protein_factor = this.templateFood.protein_g !== null ? +this.templateFood.protein_g / +this.templateFood.g_or_ml : 0.0;
      this.food.fat_factor = this.templateFood.fat_g !== null ? +this.templateFood.fat_g / +this.templateFood.g_or_ml : 0.0;
      this.food.fiber_factor = this.templateFood.fiber_g !== null ? +this.templateFood.fiber_g / +this.templateFood.g_or_ml : 0.0;
      this.food.alcohol_factor = this.templateFood.alcohol_g !== null ? +this.templateFood.alcohol_g / +this.templateFood.g_or_ml : 0.0;
    }
  }
}

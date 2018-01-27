import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodSelected, selection_kcal, weight } from '../../models/food-model';

@Component({
  selector: 'food-selected',
  templateUrl: 'food-selected.html'
})
export class FoodSelectedComponent {
  @Input() foodSelected: FoodSelected

  @Input() showCarbs:boolean = false;
  @Input() showProteins:boolean = false;
  @Input() showFats:boolean = false;
  @Input() showFiber:boolean = false;
  @Input() showAlcohol:boolean = false;
  @Input() showKCal:boolean = false;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();
  @Output() foodSelection = new EventEmitter<any>();


  constructor() {}

  // useful for templates. Maybe we can code a pipe for this
  round(n: number){ return Math.round(n * 10.) / 10.; }

  selection(){

  }

  kcal(){ 
    return selection_kcal(this.foodSelected);
  }

  weight() {
    return weight(this.foodSelected);
  }
}

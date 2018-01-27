import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodSelected, selection_kcal, weight, FoodDetailable } from '../../models/food-model';
import { style, state, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'food-selected',
  templateUrl: 'food-selected.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(300, style({opacity: 1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({opacity: 0})) 
      ])
    ])
  ]

})
export class FoodSelectedComponent {
  /*
  This component is for food selected, to show kcal, grams of carbs, proteins, etc. This also
  allow users to modify the selection
  */
  @Input() foodSelected: FoodSelected

  @Input() showCarbs:boolean = false;
  @Input() showProteins:boolean = false;
  @Input() showFats:boolean = false;
  @Input() showFiber:boolean = false;
  @Input() showAlcohol:boolean = false;
  @Input() showKCal:boolean = false;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();
  @Output() unselectFood = new EventEmitter<any>();

  selectionMode:boolean = false;
  selectionModeFood: FoodSelected = null;

  constructor() {}

  doClick(){ // selection
    if(!this.selectionMode) {
      this.openSelection();
    }
  }

  openSelection() {
    this.selectionModeFood = {
      food: <FoodDetailable>this.foodSelected.food,
      carb_g: 0,
      protein_g: 0,
      fat_g: 0,
      fiber_g: 0,
      alcohol_g: 0,
      selection: "",
    }
    this.selectionMode = true;
  }

  selectionFinishedCallback(foodSelected: FoodSelected) {
    // food here it's a copy, not a reference
    if(foodSelected !== null) {
      this.foodMessage.emit('Selected food Modified');
    }
    setTimeout(() => { this.selectionMode = false; this.selectionModeFood = null; }, 100);
  }

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

  unselect(item){
    item.close();
    this.unselectFood.emit();
  }
}

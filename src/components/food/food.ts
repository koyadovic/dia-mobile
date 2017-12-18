import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'food-component',
  templateUrl: 'food.html'
})
export class FoodComponent {
  @Input() food;
  @Output() foodClick = new EventEmitter<any>();

  constructor() {
  }

  doClick(){
    this.foodClick.emit();
  }

}

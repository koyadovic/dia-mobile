import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-field',
  templateUrl: 'dynamic-field-component.html'
})
export class DynamicField {
  @Input() field;

  constructor() {

  }

}

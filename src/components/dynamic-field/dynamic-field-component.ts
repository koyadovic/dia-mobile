import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-field',
  templateUrl: 'dynamic-field-component.html'
})
export class DynamicField {
  @Input() field;

  constructor() {
  }

  ngOnChanges(changes) {
    if ("field" in changes) {
      console.log(JSON.stringify(this.field));
    }
  }

}

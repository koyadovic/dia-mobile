import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dynamic-field',
  templateUrl: 'dynamic-field-component.html'
})
export class DynamicField {
  @Input() field;
  @Output() haveChanges = new EventEmitter();

  constructor() {
  }

  emitHaveChanges(){
    this.haveChanges.emit(
      {
        namespace_key: this.field.namespace_key,
        value: this.field.value
      }
    );
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';

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
    if(this.field.type == 'date'){
      console.log(moment(this.field.value).creationData().format);
      this.haveChanges.emit(
        {
          namespace_key: this.field.namespace_key,
          value: new Date(this.field.value).getTime() / 1000.
        }
      );
    } else {
      this.haveChanges.emit(
        {
          namespace_key: this.field.namespace_key,
          value: this.field.value
        }
      );
    }
  }

  getFormat(){
    let format = moment().creationData().format;
    console.log(format);
    return format;
  }
}

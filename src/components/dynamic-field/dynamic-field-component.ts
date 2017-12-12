import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'dynamic-field',
  templateUrl: 'dynamic-field-component.html'
})
export class DynamicField {
  @Input() field;

  @Input() dateFormat;
  @Input() timezone;

  @Output() haveChanges = new EventEmitter();

  constructor() {
  }

  ngOnChanges(changes) {
    if("field" in changes) {
      if(this.field.type == 'date'){
        if (!this.field.value) {
          this.field.value = moment().format('YYYY-MM-DDTHH:mm:ssZ');
        }
        this.haveChanges.emit(
          {
            namespace_key: this.field.namespace_key,
            value: new Date(this.field.value).valueOf() / 1000.
          }
        );
      }      
    }
  }

  emitHaveChanges(){
    if(this.field.type == 'date'){
      this.haveChanges.emit(
        {
          namespace_key: this.field.namespace_key,
          value: new Date(this.field.value).valueOf() / 1000.
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

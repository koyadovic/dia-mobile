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

  private firstChanged: boolean = false;

  constructor() {
    this.updateValue();
  }

  ngOnChanges(changes) {
    if("field" in changes) {
      this.updateValue();
      if(!this.firstChanged){
        this.firstChanged = true;
      }
    }
  }

  private updateValue() {
    if(this.field && this.field.type == 'date'){
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      if (!this.field.value) {
        this.field.value  = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      } else {
        this.field.value  = (new Date(new Date(this.field.value).getTime() - tzoffset)).toISOString().slice(0, -1);
      }
    }

    if(this.firstChanged)
      this.emitHaveChanges();
  }

  private emitHaveChanges(){
    if(this.field) {
      if(this.field.type == 'date'){
        this.haveChanges.emit(
          {
            namespace_key: this.field.namespace_key,
            value: new Date(this.field.value).valueOf()
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
  }
}

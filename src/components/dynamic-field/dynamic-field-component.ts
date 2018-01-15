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
      this.field["valid"] = false;
      this.updateValue();
      this.updateValid();
      if(!this.firstChanged){
        this.firstChanged = true;
      }
    }
  }

  private updateValue() {
    if(this.field && this.field.type == 'date'){
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      if (!this.field.value || this.field.value === "invalid") {
        this.field.value  = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      } else {
        this.field.value  = (new Date(new Date(this.field.value).getTime() - tzoffset)).toISOString().slice(0, -1);
      }
    }

    if(this.firstChanged)
      this.emitHaveChanges();
  }

  private emitHaveChanges(){
    this.updateValid();

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

  private updateValid() {
    let f = this.field;

    if(f.required && !(f.value)) {
      f.valid = false;
    }

    if(f.type === 'date') {
      let d = new Date(f.value);
      if ( Object.prototype.toString.call(d) === "[object Date]" ) {
        if ( isNaN( d.getTime() ) ) {
          if(f.required) {
            f.valid = false;
          } else {
            f.valid = true;
          }
        }
        else {
          f.valid = true;
        }
      }
      else {
        if(f.required) {
          f.valid = false;
        } else {
          f.valid = true;
        }
      }
    }

    else if(f.type === 'text') {
      if(f.regex !== '') {
        let regex = new RegExp(f.regex);
        f.valid = regex.test(f.value);
      }
      f.valid = true;
    }

    else if(f.type === 'number') {
      let n = parseFloat(f.value);
      f.valid = ! isNaN(n);
    }

    else if(f.type === 'select') {
      if(!!f.options && f.options.length > 0) {
        let options = f.options.map((x) => x.value);
        f.valid = f.value in options;
      } else {
        f.valid = true;
      }
    }

    else if(f.type === 'boolean') {
      f.valid = f.value in [true, false];
    }
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'dynamic-field',
  templateUrl: 'dynamic-field-component.html'
})
export class DynamicField {
    /*
    field is something like the following:
        {
        "display": "Instante",
        "value": "",
        "required": false,
        "hint": "",
        "type": "date",
        "regex": "",
        "key": "datetime",
        "namespace_key": "datetime",
        "additional_options": {
            "format": "DD/MM/YYYY HH:mm"
        },
        "disabled": true,
        "show": true
        }

    */
    @Input() field;

    @Input() dateFormat;
    @Input() timezone;

    @Output() haveChanges = new EventEmitter();

    constructor() {
        this.updateValue();
    }

    ngOnChanges(changes) {
        if("field" in changes) {
        this.field["valid"] = false;
        this.updateValue();
        this.updateValid();
        }
    }

    private updateValue() {
        if(this.field) {
        if(this.field.type == 'date'){
            let tzoffset = (new Date()).getTimezoneOffset() * 60000;
            if (!this.field.value || this.field.value === "invalid") {
                console.log('value not set or invalid for date');
            this.field.value  = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            } else {
                console.log('Value correct for date');
            this.field.value  = (new Date(new Date(this.field.value).getTime() - tzoffset)).toISOString().slice(0, -1);
            }
        }
        else if(this.field.type == 'select' || this.field.type == 'radio') {
            // the idea here is when we have a field that has no default value specified and options length has elements
            // set as default value the first option value
            let options = this.field.options.map((x) => '' + x.value);
            this.field.value = this.field.value + '';

            if(options.indexOf(this.field.value) < 0 && options.length > 0){
            this.field.value = options[0];
            }
        }
        }
    }

    private emitHaveChanges(){
        this.updateValid();
        if(!this.field.valid) {
            return;
        }

        let tzoffset = (new Date()).getTimezoneOffset() * 60000;
        let currentTime = new Date(this.field.value).valueOf();
        currentTime += tzoffset;

        if(this.field) {
            if(this.field.type == 'date'){
                let data = {
                    namespace_key: this.field.namespace_key,
                    value: currentTime
                };
                console.log('Emiting changes: ' + JSON.stringify(data));
                this.haveChanges.emit(data);
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

        if(f.type === 'action'){
            f.valid = true;
            return;
        }

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

        else if(f.type === 'select' || f.type === 'radio') {
            if(!!f.options && f.options.length > 0) {
                let options = f.options.map((x) => '' + x.value);
                f.valid = options.indexOf('' + f.value) > -1;
            } else {
                f.valid = true;
            }
        }

        else if(f.type === 'boolean') {
          f.valid = f.value in [true, false];
        }
    }

    // Useful for long ion-select widgets to scroll down to current selected item.
    onSelectClicked(): void {
        // This scroll to selected option in the timezone ion-select field.
        // These classes come from the generated elements for the ion-select/ion-option
        const options: HTMLCollectionOf<Element> = document.getElementsByClassName('alert-tappable alert-radio');
        setTimeout(() => {
        let i: number = 0;
        const len: number = options.length;
        for (i; i < len; i++) {
            if ((options[i] as HTMLElement).attributes[3].nodeValue === 'true') {
                options[i].scrollIntoView({ block: 'end', behavior: 'instant' });
            }
        }
        }, 2000); // Leave enough time for the popup to render
    }
  
}

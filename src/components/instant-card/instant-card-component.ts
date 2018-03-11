import { Component, Input } from '@angular/core';
import { UserConfiguration } from '../../utils/user-configuration';
import * as moment from 'moment';


@Component({
  selector: 'instant-card',
  templateUrl: 'instant-card-component.html'
})
export class DiaInstantCard {
    @Input() instant;
    @Input() userConfig: UserConfiguration;
    now = new Date().getTime() / 1000;

    activity_intensities = {
        "1": "Soft",
        "2": "Medium",
        "3": "High",
        "4": "Extreme",
    };

    trait_types = {
        "1": "Birth Date",
        "2": "Height",
        "3": "Weight",
        "4": "Neck Perimeter",
        "5": "Abdomen Perimeter",
        "6": "Waist Perimeter",
        "7": "Sex",
    }

    trait_types_measure = {
        "1": "",
        "2": "cm",
        "3": "kg",
        "4": "cm",
        "5": "cm",
        "6": "cm",
        "7": "",
    }

    constructor() {
    }

    private appendClass(classes, newClass) {
        if(classes === '') {
            return classes += newClass;
        } else {
            return classes += " " + newClass;
        }
    }

    getInstantClass() {
        let classes:string = '';

        // if instant is future, style it differently.
        if(this.instant.datetime > this.now) {
            classes = this.appendClass(classes, 'future');
        }

        if (this.instant.content.type === 'action-request') {
            classes = this.appendClass(classes, 'action-request');

            if(this.instant.content.status === 0) { // unattended
                classes = this.appendClass(classes, 'unattended');
            }
            else if(this.instant.content.status === 1) { // ignored
                classes = this.appendClass(classes, 'ignored');
            }
            else if(this.instant.content.status === 2) { // done
                classes = this.appendClass(classes, 'done');
            }
        }

        return classes;
    }

    timePassedString(seconds:number){
        return moment(seconds * 1000).fromNow();
    }
}

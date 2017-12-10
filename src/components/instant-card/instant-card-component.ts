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

    timePassedString(seconds:number){
        return moment(seconds * 1000).fromNow();
    }
}

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

    constructor() {
    }

    timePassedString(seconds:number){
        return moment(seconds * 1000).fromNow();
    }
}

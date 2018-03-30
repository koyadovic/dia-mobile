import { Component, Input } from '@angular/core';
import { UserConfiguration } from '../../utils/user-configuration';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';


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
        "2": "Height",
        "3": "Weight",
        "4": "Neck Perimeter",
        "5": "Abdomen Perimeter",
        "6": "Waist Perimeter",
    }

    trait_types_measure = {
        "2": "cm",
        "3": "kg",
        "4": "cm",
        "5": "cm",
        "6": "cm",
    }

    constructor(private translate: TranslateService) {
        //this.translate
        forkJoin(
            this.translate.get("Soft"),
            this.translate.get("Medium"),
            this.translate.get("High"),
            this.translate.get("Extreme"),

            this.translate.get("Birth Date"),
            this.translate.get("Height"),
            this.translate.get("Weight"),
            this.translate.get("Neck Perimeter"),
            this.translate.get("Abdomen Perimeter"),
            this.translate.get("Waist Perimeter"),
            this.translate.get("Sex"),
          ).subscribe(([textSoft, textMedium, textHigh, textExtreme, textBirthDate, textHeight, textWeight,
            textNeckPerimeter, textAbdomenPerimeter, textWaistPerimeter, textSex]) => {
                this.activity_intensities["1"] = textSoft;
                this.activity_intensities["2"] = textMedium;
                this.activity_intensities["3"] = textHigh;
                this.activity_intensities["4"] = textExtreme;

                this.trait_types["1"] = textBirthDate;
                this.trait_types["2"] = textHeight;
                this.trait_types["3"] = textWeight;
                this.trait_types["4"] = textNeckPerimeter;
                this.trait_types["5"] = textAbdomenPerimeter;
                this.trait_types["6"] = textWaistPerimeter;
                this.trait_types["7"] = textSex;
          });
    }

    private appendClass(classes, newClass) {
        if(classes === '') {
            return classes += newClass;
        } else {
            return classes += " " + newClass;
        }
    }

    round(n) {
        return Math.round(n);
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

        // group of days
        if (this.instant.is_start) {
            classes = this.appendClass(classes, 'day-group-start');
        }
        if (this.instant.is_end) {
            classes = this.appendClass(classes, 'day-group-end');
        }

        return classes;
    }

    timePassedString(seconds:number){
        return moment(seconds * 1000).fromNow();
    }
}

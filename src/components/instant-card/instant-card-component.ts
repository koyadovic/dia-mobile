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
        "1": "Soft (Walk)",
        "2": "Medium (Heavy walk)",
        "3": "High (Run, weightlifting)",
        "4": "Extreme (Sprints, HIIT)",
    };

    trait_types = {
        "1": "Weight",
        "2": "Height",
        "3": "Neck Perimeter",
        "4": "Abdomen/Waist Perimeter",
        "5": "Hip Perimeter",
    }

    trait_types_measure = {
        "1": "kg",
        "2": "cm",
        "3": "cm",
        "4": "cm",
        "5": "cm",
    }

    constructor(private translate: TranslateService) {
        forkJoin(
            this.translate.get("Soft (Walk)"),
            this.translate.get("Medium (Heavy walk)"),
            this.translate.get("High (Run, weightlifting)"),
            this.translate.get("Extreme (Sprints, HIIT)"),

            this.translate.get("Birth Date"),
            this.translate.get("Height"),
            this.translate.get("Weight"),
            this.translate.get("Neck Perimeter"),
            this.translate.get("Abdomen/Waist Perimeter"),
            this.translate.get("Hip Perimeter"),
            this.translate.get("Sex"),
          ).subscribe(([textSoft, textMedium, textHigh, textExtreme, textBirthDate, textHeight, textWeight,
            textNeckPerimeter, textAbdomenWaistPerimeter, textHipPerimeter, textSex]) => {
                this.activity_intensities["1"] = textSoft;
                this.activity_intensities["2"] = textMedium;
                this.activity_intensities["3"] = textHigh;
                this.activity_intensities["4"] = textExtreme;

                this.trait_types["1"] = textWeight;
                this.trait_types["2"] = textHeight;
                this.trait_types["3"] = textNeckPerimeter;
                this.trait_types["4"] = textAbdomenWaistPerimeter;
                this.trait_types["5"] = textHipPerimeter;
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
        if (this.instant.content.type === 'attention-request') {
            classes = this.appendClass(classes, 'attention-request');
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

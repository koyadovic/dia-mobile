import { Component, Input } from '@angular/core';
import { Planning } from '../../models/plannings-model';


@Component({
  selector: 'planning-list',
  templateUrl: 'planning-list.html'
})
export class PlanningListComponent {
  @Input() planning: Planning;

  constructor() {
  }

  local_hour() {
    let hour = this.planning.local_hour < 10 ? `0${this.planning.local_hour}` : `${this.planning.local_hour}`;
    let minute = this.planning.local_minute < 10 ? `0${this.planning.local_minute}` : `${this.planning.local_minute}`;
    return `${hour}:${minute}`;
  }

}

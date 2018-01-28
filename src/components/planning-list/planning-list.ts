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

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'dia-instant-card',
  templateUrl: 'instant-card-component.html'
})
export class DiaInstantCard {
  @Input() instant;

  constructor() {
  }

}

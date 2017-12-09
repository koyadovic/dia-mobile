import { Component, Input } from '@angular/core';
import { UserConfiguration } from '../../utils/user-configuration';

@Component({
  selector: 'dia-instant-card',
  templateUrl: 'instant-card-component.html'
})
export class DiaInstantCard {
  @Input() instant;
  @Input() userConfig: UserConfiguration;

  constructor() {
  }

}

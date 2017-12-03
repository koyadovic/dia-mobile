import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-root',
  templateUrl: 'dynamic-root-component.html'
})
export class DynamicRoot {
  @Input() configurationRoot;

  constructor() {
  }

}

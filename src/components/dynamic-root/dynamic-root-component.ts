import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dynamic-root',
  templateUrl: 'dynamic-root-component.html'
})
export class DynamicRoot {
  @Input() configurationRoot;
  @Output() changeRootRequest = new EventEmitter();

  constructor() {
  }

  requestRootChange(newRoot) {
    this.changeRootRequest.emit(newRoot);
  }

}

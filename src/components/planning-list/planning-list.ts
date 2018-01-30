import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Planning } from '../../models/plannings-model';


@Component({
  selector: 'planning-list',
  templateUrl: 'planning-list.html'
})
export class PlanningListComponent {
  @Input() planning: Planning;

  @Output() editRequestEvent = new EventEmitter();
  @Output() deleteRequestEvent = new EventEmitter();
  @Output() saveRequestEvent = new EventEmitter();

  timerForSaving = null;

  constructor() {
  }

  local_hour() {
    let hour = this.planning.local_hour < 10 ? `0${this.planning.local_hour}` : `${this.planning.local_hour}`;
    let minute = this.planning.local_minute < 10 ? `0${this.planning.local_minute}` : `${this.planning.local_minute}`;
    return `${hour}:${minute}`;
  }

  toggleChange(){
    if(this.timerForSaving !== null) {
      clearTimeout(this.timerForSaving);
    }
    this.timerForSaving = setTimeout(this.save.bind(this), 500);
  }

  private save() {
    this.saveRequestEvent.emit();
  }

  deleteRequest(item) {
    item.close();
    this.deleteRequestEvent.emit();
  }

  editRequest(item) {
    item.close();
    this.editRequestEvent.emit();
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'timezone-selector',
  templateUrl: 'timezone-selector.html'
})
export class TimezoneSelectorComponent {
  private _timezoneOptions = [];
  private timezoneStructure = {};

  @Input()
  get timezoneOptions(){
    return this._timezoneOptions;
  }
  set timezoneOptions(timezoneOptions){
    this._timezoneOptions = timezoneOptions;
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    
    if(this._timezoneOptions === undefined) return;

    for(let n=0; n<this.timezoneOptions.length; n++){
      let option = this.timezoneOptions[n];

      let levels = option['display'].split('/');
      let largeAreaName = levels[0];
      let preciseAreaName = levels[1];

      if(! (largeAreaName in this.timezoneStructure)) {
        this.timezoneStructure[largeAreaName] = {};
      }

      if(! (preciseAreaName in this.timezoneStructure[largeAreaName])) {
        this.timezoneStructure[largeAreaName][preciseAreaName] = option['value'];
      }
    }

    console.log("Result:\n" + JSON.stringify(this.timezoneStructure));
  }

  constructor() { }

}

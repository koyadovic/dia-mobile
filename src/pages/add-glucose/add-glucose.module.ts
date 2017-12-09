import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddGlucosePage } from './add-glucose';

@NgModule({
  declarations: [
    AddGlucosePage,
  ],
  imports: [
    IonicPageModule.forChild(AddGlucosePage),
  ],
})
export class AddGlucosePageModule {}

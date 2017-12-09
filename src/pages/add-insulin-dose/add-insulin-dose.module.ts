import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInsulinDosePage } from './add-insulin-dose';

@NgModule({
  declarations: [
    AddInsulinDosePage,
  ],
  imports: [
    IonicPageModule.forChild(AddInsulinDosePage),
  ],
})
export class AddInsulinDosePageModule {}

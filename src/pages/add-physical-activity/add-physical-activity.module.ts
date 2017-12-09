import { NgModule } from '@angular/core'; 
import { IonicPageModule } from 'ionic-angular'; 
import { AddPhysicalActivityPage } from './add-physical-activity'; 
 
@NgModule({ 
  declarations: [ 
    AddPhysicalActivityPage, 
  ], 
  imports: [ 
    IonicPageModule.forChild(AddPhysicalActivityPage), 
  ], 
}) 
export class AddPhysicalActivityPageModule {} 
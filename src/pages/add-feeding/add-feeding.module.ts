import { NgModule } from '@angular/core'; 
import { IonicPageModule } from 'ionic-angular'; 
import { AddFeedingPage } from './add-feeding'; 
 
@NgModule({ 
  declarations: [ 
    AddFeedingPage, 
  ], 
  imports: [ 
    IonicPageModule.forChild(AddFeedingPage), 
  ], 
}) 
export class AddFeedingPageModule {} 
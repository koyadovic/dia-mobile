import { NgModule } from '@angular/core';
import { InsightsChartPieComponent } from './insights-chart-pie/insights-chart-pie';
import { InsightsChartLinesComponent } from './insights-chart-lines/insights-chart-lines';
import { InsightsChartColumnsComponent } from './insights-chart-columns/insights-chart-columns';
import { InsightsChartDonutComponent } from './insights-chart-donut/insights-chart-donut';
import { InsightsChartKeyValuesComponent } from './insights-chart-key-values/insights-chart-key-values';
import { InsightsChartTableComponent } from './insights-chart-table/insights-chart-table';
import { DynamicField } from './dynamic-field/dynamic-field-component';
import { DynamicRoot } from './dynamic-root/dynamic-root-component';
import { DiaInstantCard } from './instant-card/instant-card-component';
import { FoodComponent } from './food/food';
import { FoodEditorComponent } from './food-editor/food-editor';
import { FoodSelectionComponent } from './food-selection/food-selection';
import { FoodSelectedComponent } from './food-selected/food-selected';
import { FoodSummaryComponent } from './food-summary/food-summary';
import { PlanningListComponent } from './planning-list/planning-list';
import { InsightsChartComponent } from './insights-chart/insights-chart';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from 'ionic-angular/module';
import { DiaMobileApp } from '../app/app-component';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app/app.module';
import { HttpClient } from '@angular/common/http';
import { IonPullupModule } from 'ionic-pullup';



@NgModule({
	declarations: [
        PlanningListComponent,
        DiaInstantCard,
        FoodSummaryComponent,
        FoodSelectionComponent,
        FoodSelectedComponent,
        FoodEditorComponent,
        FoodComponent,
        DynamicRoot,
        DynamicField,
        InsightsChartComponent,
        InsightsChartPieComponent,
        InsightsChartLinesComponent,
        InsightsChartColumnsComponent,
        InsightsChartDonutComponent,
        InsightsChartKeyValuesComponent,
        InsightsChartTableComponent,
    ],
	imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(DiaMobileApp),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        IonPullupModule,
    ],
	exports: [
        PlanningListComponent,
        DiaInstantCard,
        FoodSummaryComponent,
        FoodSelectionComponent,
        FoodSelectedComponent,
        FoodEditorComponent,
        FoodComponent,
        DynamicRoot,
        DynamicField,
        InsightsChartComponent,
        InsightsChartPieComponent,
        InsightsChartLinesComponent,
        InsightsChartColumnsComponent,
        InsightsChartDonutComponent,
        InsightsChartKeyValuesComponent,
        InsightsChartTableComponent,
    ]
})
export class ComponentsModule {}

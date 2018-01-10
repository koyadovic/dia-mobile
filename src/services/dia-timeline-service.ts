import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { DiaAuthService } from './dia-auth-service';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

import { GlucoseLevel } from '../models/glucose-model';
import { Feeding } from '../models/feeding-model';
import { PhysicalActivity } from '../models/physical-activity-model';
import { InsulinDose } from '../models/insulin-dose-model';
import { PhysicalTrait } from '../models/physical-trait-model';


@Injectable()
export class DiaTimelineService {
    //private timeline$ = new ReplaySubject<any>(1);

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService) {
    }

    getTimeline(before?:number) {
        let url = '';
        if(!!before) {
            url = `${this.backendURL.baseURL}/v1/instants/timeline/?before=${before}`;
        } else {
            url = `${this.backendURL.baseURL}/v1/instants/timeline/`;
        }
        return this.restBackendService.genericGet(url);
    }

    getInsulinTypes():Observable<any> {
        let url = `${this.backendURL.baseURL}/v1/instants/insulin-types/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .subscribe(
            (response) => {
                observer.next(response);
                observer.complete();
            },
            (err) => {
                observer.complete();
            });
        });
    }

    saveFood(food):Observable<any> {
        let url = `${this.backendURL.baseURL}/v1/foods/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, food)
            .subscribe((food) => {
                observer.next(food);
                observer.complete();
            },
            (err) => {
                observer.complete();
            });
        });
    }

    searchFood(searchString:string):Observable<any[]> {
        let url = `${this.backendURL.baseURL}/v1/foods/sources/?q=${searchString}`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .subscribe((foods) => {
                observer.next(foods);
                observer.complete();
            },
            (err) => {
                observer.complete();
            });
        });
    }

    saveFeeding(foodSelected: object[]):Observable<any> {
        // we only need id, gr_selected and units_selected
        let foodMinified = foodSelected.map(
            (food) => {
                return {id: food["id"], gr_selected: food["gr_selected"], units_selected: food["units_selected"]} ;
            }
        );
        let url = `${this.backendURL.baseURL}/v1/instants/feedings/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, {foods: foodMinified})
            .subscribe((feeding) => {
                observer.next(feeding);
                observer.complete();
            },
            (err) => {
                observer.complete();
            });
        });
    }

    getGlucoseEndpoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/glucoses/`;
    }


    getFeedingEndPoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/feedings/`;
    }


    getPhysicalActivityEndPoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/activities/`;
    }


    getPhysicalTraitChangeEndPoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/traits/`;
    }

    getInsulinDoseEndPoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/insulins/`;
    }
}
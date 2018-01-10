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
            .finally(() => observer.complete())
            .subscribe(
            (response) => {
                observer.next(response);
            });
        });
    }

    saveFood(food):Observable<any> {
        let url = `${this.backendURL.baseURL}/v1/foods/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, food)
            .finally(() => observer.complete())
            .subscribe((food) => {
                observer.next(food);
                observer.complete();
            });
        });
    }
    getFoods(favorite: boolean):Observable<any[]> {
        let url = `${this.backendURL.baseURL}/v1/foods/?favorite=${favorite}`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((foods) => {
                observer.next(foods);
            });
        });
    }

    searchFood(searchString:string):Observable<any[]> {
        let url = `${this.backendURL.baseURL}/v1/foods/sources/?q=${searchString}`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((foods) => {
                observer.next(foods);
            });
        });
    }
    searchedFoodDetails(source_name: string, source_id: number){
        let url = `${this.backendURL.baseURL}/v1/foods/sources/${source_name}/${source_id}/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((food) => {
                observer.next(food);
            });
        });
    }

    saveFeeding(foodSelected: object[]):Observable<any> {
        let url = `${this.backendURL.baseURL}/v1/instants/feedings/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, {foods: foodSelected})
            .finally(() => observer.complete())
            .subscribe((feeding) => {
                observer.next(feeding);
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
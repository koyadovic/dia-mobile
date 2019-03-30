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
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserConfiguration } from '../utils/user-configuration';
import { DiaConfigurationService } from './dia-configuration-service';
import { TranslateService } from '@ngx-translate/core';

import { DiaFood, FoodListable, InternetFoodList, InternetFoodDetail, FoodSelected } from '../models/food-model';
import { Events } from 'ionic-angular';


@Injectable()
export class DiaTimelineService {
    private glucoseFields;
    private feedingFields;
    private medicationTakeFields;
    private activityFields;
    private traitFields;

    private userMedicationBrands = [];
    //public userGroups = [];

    private userConfig: UserConfiguration;

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private configurationService: DiaConfigurationService,
                public authenticationService: DiaAuthService,
                public events: Events,
                private translate: TranslateService) {

        this.userConfig = this.configurationService.getUserConfiguration();
        this.refreshElementFields();

    }

    refreshElementFields() {
        // this get the user medications from the bankend
        let medicationURL = `${this.backendURL.baseURL}/v1/medications/mine/`;
        this.restBackendService.genericGet(medicationURL).subscribe(
            (resp) => {
                this.userMedicationBrands = resp;
                this.buildElementFields();
            },
            (err) => {
                console.error('Error retrieving user medication brands: ' + err);
            }
        );
    }

    adjustRecommendations() {
        let url = `${this.backendURL.baseURL}/v1/instants/adjust-recommendations/`;
        return this.restBackendService.genericPost(url, {});
    }

    getRecommendation() {
        let url = `${this.backendURL.baseURL}/v1/instants/get-recommendation/`;
        return this.restBackendService.genericPost(url, {});
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

    deleteInstant(instantID: number, signature: string) {
        let url = `${this.backendURL.baseURL}/v1/instants/timeline/${instantID}/?signature=${signature}`;
        return this.restBackendService.genericDelete(url);
    }

    getBackendNotices() {
        let url = `${this.backendURL.baseURL}/v1/notifications/notices/`;
        return this.restBackendService.genericGet(url);
    }

    getUserMessages() {
        let url = `${this.backendURL.baseURL}/v1/notifications/user-messages/`;
        return this.restBackendService.genericGet(url);
    }

    deleteFood(food: DiaFood):Observable<any> {
        if(!!food.id) {
            let url = `${this.backendURL.baseURL}/v1/foods/${food.id}/`;
            return Observable.create((observer) => {
                this.restBackendService
                .genericDelete(url)
                .finally(() => observer.complete())
                .subscribe((resp) => {
                    observer.next({});
                    observer.complete();
                });
            });
        } else {
            return Observable.create((observer) => {
                observer.complete();
            });
        }
    }

    saveFood(food: DiaFood):Observable<DiaFood> {
        if(!!food.id) {
            let url = `${this.backendURL.baseURL}/v1/foods/${food.id}/`;
            return Observable.create((observer) => {
                this.restBackendService
                .genericPut(url, food)
                .finally(() => observer.complete())
                .subscribe((food) => {
                    observer.next(food);
                    observer.complete();
                });
            });
                
        } else {
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
    }

    favoriteFood(food: DiaFood, favorite:boolean):Observable<DiaFood> {
        let url;
        if(favorite) {
            url = `${this.backendURL.baseURL}/v1/foods/${food.id}/favorite/`;
        } else {
            url = `${this.backendURL.baseURL}/v1/foods/${food.id}/unfavorite/`;
        }

        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, {})
            .finally(() => observer.complete())
            .subscribe((food) => {
                observer.next(food);
            });
        });
    }
    
    getFoods(favorite: boolean):Observable<DiaFood[]> {
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

    searchFood(searchString:string):Observable<InternetFoodList[]> {
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

    searchedFoodDetails(food: InternetFoodList): Observable<InternetFoodDetail> {
        let url = `${this.backendURL.baseURL}/v1/foods/sources/${food.source_name}/${food.source_id}/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((food) => {
                observer.next(food);
            });
        });
    }

    saveFeeding(foodSelected: FoodSelected[]): Observable<any> {
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

    completeAllGenericTypes(data) {
        data["types"] = {};
        data["elements"].forEach(element => {
            if (!(element["type"] in data["types"])) {
                data["types"][element["type"]] = this.getGenericType(<"glucose" | "trait" | "activity" | "medication-take">element["type"]);
            }
        });
    }

    getGenericType(type:"glucose" | "trait" | "activity" | "medication-take") {
        let url = "";
        let fields = [];

        switch (type) {
            case "glucose":
                url = this.getGlucoseEndpoint();
                fields = this.getGlucoseFields();
                break;
            case "trait":
                url = this.getPhysicalTraitChangeEndPoint();
                fields = this.getTraitFields();
                break;
            case "activity":
                url = this.getPhysicalActivityEndPoint();
                fields = this.getPhysicalActivityFields();
                break;
            case "medication-take":
                url = this.getMedicationTakeEndPoint();
                fields = this.getMedicationTakeFields();
                break;
        }

        return {
            "url": url,
            "fields": fields
        }
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

    getMedicationTakeEndPoint(): string {
        return `${this.backendURL.baseURL}/v1/instants/medications/`;
    }


    getGlucoseFields() {
        return this.glucoseFields.map((x) => Object.assign({}, x))
    }

    getMedicationTakeFields() {
        return this.medicationTakeFields.map((x) => Object.assign({}, x))
    }

    getTraitFields() {
        return this.traitFields.map((x) => Object.assign({}, x))
    }

    getPhysicalActivityFields() {
        return this.activityFields.map((x) => Object.assign({}, x))
    }


    private buildGlucoseFields() {
        forkJoin(
            this.translate.get("Instant"),
            this.translate.get("Level"),
          ).subscribe(([instant, level]) => {
            this.glucoseFields = [
                {
                    "display": instant,
                    "value": "",
                    "required": false,
                    "hint": "",
                    "type": "date",
                    "regex": "",
                    "key": "datetime",
                    "namespace_key": "datetime",
                    "additional_options": {
                    "format": `${this.userConfig.getValue(UserConfiguration.DATE_FORMAT)} HH:mm`
                    }
                },
                {
                    "display": level,
                    "value": "",
                    "required": true,
                    "hint": "mg/dL",
                    "type": "number",
                    "regex": "",
                    "key": "level",
                    "namespace_key": "level"
                }
            ];
        });
    }

    private buildPhysicalActivityFields() {
        forkJoin(
            this.translate.get("Instant"),
            this.translate.get("Intensity"),
            this.translate.get("Minutes"),
            this.translate.get("Number of minutes"),
            this.translate.get("Soft (Walk)"),
            this.translate.get("Medium (Heavy walk)"),
            this.translate.get("High (Run, weightlifting)"),
            this.translate.get("Extreme (Sprints, HIIT)"),
          ).subscribe(([instant, intensity, minutes, numberMinutes,
          soft, medium, high, extreme]) => {
      
            this.activityFields = [
                {
                    "display": instant,
                    "value": "",
                    "required": false,
                    "hint": "",
                    "type": "date",
                    "regex": "",
                    "key": "datetime",
                    "namespace_key": "datetime",
                    "additional_options": {
                        "format": `${this.userConfig.getValue(UserConfiguration.DATE_FORMAT)} HH:mm`
                    }
                },
                {
                    "display": intensity,
                    "value": 1,
                    "required": true,
                    "hint": "",
                    "type": "radio",
                    "regex": "",
                    "key": "intensity",
                    "options": [
                        { "display": soft, "value": "1" },
                        { "display": medium, "value": "2" },
                        { "display": high, "value": "3" },
                        { "display": extreme, "value": "4" },
                    ],
                    "namespace_key": "intensity"
                },
                {
                    "display": minutes,
                    "value": "",
                    "required": true,
                    "hint": numberMinutes,
                    "type": "number",
                    "regex": "",
                    "key": "minutes",
                    "namespace_key": "minutes"
                },
            ]
        });
    }

    buildMedicationTakeFields() {
        forkJoin(
            this.translate.get("Instant"),
            this.translate.get("Medication"),
            this.translate.get("Press to add your medications"),
            this.translate.get("Amount"),
            this.translate.get("Amount of medication"),
          ).subscribe(([instant, medication, medicationEdit, amount, amountHint]) => {
              this.medicationTakeFields = [
                {
                    "display": instant,
                    "value": "",
                    "required": false,
                    "hint": "",
                    "type": "date",
                    "regex": "",
                    "key": "datetime",
                    "namespace_key": "datetime",
                    "additional_options": {
                        "format": `${this.userConfig.getValue(UserConfiguration.DATE_FORMAT)} HH:mm`
                    }
                },
                this.userMedicationBrands.length === 0 ? {
                    "display": medicationEdit,
                    "value": "medication_edition_request",
                    "required": true,
                    "hint": "",
                    "type": "action",
                    "regex": "^.*$",
                    "key": "medication_edition_request",
                    "options": [],
                    "namespace_key": "medication_edition_request"
                } : {
                    "display": medication,
                    "value": this.userMedicationBrands.length > 0 ? '' + this.userMedicationBrands[0].id : null,
                    "required": true,
                    "hint": medication,
                    "type": "radio",
                    "regex": "^.*$",
                    "key": "medication",
                    "options": this.userMedicationBrands.map((x) => {
                        return {display: x.name, value: '' + x.id}
                    }),
                    "namespace_key": "medication"
                },
                {
                    "display": amount,
                    "value": "",
                    "required": true,
                    "hint": amountHint,
                    "type": "number",
                    "regex": "^.*$",
                    "key": "amount",
                    "namespace_key": "amount"
                }
              ]
          });
    }

    buildTraitFields() {
        forkJoin(
            this.translate.get("Instant"),
            this.translate.get("Type"),
            this.translate.get("Select date"),
            this.translate.get("Value"),
            this.translate.get("Introduce a value"),
            this.translate.get("Height (cm)"),
            this.translate.get("Weight (kg)"),
            this.translate.get("Neck Perimeter (cm)"),
            this.translate.get("Abdomen/Waist Perimeter (cm)"),
            this.translate.get("Hip Perimeter (cm)"),
      
          ).subscribe(([instant, type, selectDate,
          value, introduceAValue, height, weight,
          neck, abdomen_waist, hip]) => {
              this.traitFields = [
                {
                  "display": instant,
                  "value": 0,
                  "conditional": {},
                  "required": false,
                  "hint": "",
                  "type": "date",
                  "regex": "",
                  "key": "datetime",
                  "namespace_key": "datetime",
                  "additional_options": {
                    "format": `${this.userConfig.getValue(UserConfiguration.DATE_FORMAT)} HH:mm`
                  }
                },
                {
                  "display": type,
                  "value": "1",
                  "conditional": {},
                  "required": true,
                  "hint": type,
                  "type": "radio",
                  "regex": "^.*$",
                  "key": "trait_type",
                  "options": [
                    { "display": weight, "value": "1" },
                    { "display": height, "value": "2" },
                    { "display": neck, "value": "3" },
                    { "display": abdomen_waist, "value": "4" },
                    { "display": hip, "value": "5" },
                  ],
                  "namespace_key": "trait_type"
                },
                {
                  "display": value,
                  "value": "",
                  "conditional": {
                    "$or": [
                      { "trait_type": "1" },
                      { "trait_type": "2" },
                      { "trait_type": "3" },
                      { "trait_type": "4" },
                      { "trait_type": "5" },
                    ]
                  },
                  "required": true,
                  "hint": introduceAValue,
                  "type": "number",
                  "regex": "^.*$",
                  "key": "value",
                  "namespace_key": "value"
                },
              ]
          });
    }

    buildElementFields() {
        this.buildGlucoseFields();
        this.buildPhysicalActivityFields();
        this.buildMedicationTakeFields();
        this.buildTraitFields();
    }
}
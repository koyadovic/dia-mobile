import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { DiaAuthService } from './dia-auth-service';
import { UserConfiguration } from '../utils/user-configuration';
import { DiaConfigurationService } from './dia-configuration-service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Planning } from '../models/plannings-model';


@Injectable()
export class DiaPlanningsService {
    private glucoseFields;
    private feedingFields;
    private insulinFields;
    private activityFields;
    private traitFields;

    private userConfig: UserConfiguration;

    private insulinTypes = [];
    
    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private configurationService: DiaConfigurationService,
                private authenticationService: DiaAuthService,
                private translate: TranslateService) {

        this.userConfig = this.configurationService.getUserConfiguration();
    }

    getPlannings():Observable<Planning[]> {
        let url = `${this.backendURL.baseURL}/v1/plannings/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((plannings) => {
                observer.next(plannings);
            });
        });
    }

    savePlanning(planning: Planning): Observable<Planning> {
        let url = `${this.backendURL.baseURL}/v1/plannings/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, planning)
            .finally(() => observer.complete())
            .subscribe((planning) => {
                observer.next(planning);
            });
        });
    }
    
    getPlanning(pk: number): Observable<Planning> {
        let url = `${this.backendURL.baseURL}/v1/plannings/${pk}/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((planning) => {
                observer.next(planning);
            });
        });
    }

    deletePlanning(pk: number): Observable<Planning> {
        let url = `${this.backendURL.baseURL}/v1/plannings/${pk}/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericDelete(url)
            .finally(() => observer.complete())
            .subscribe((resp) => {
                observer.next(resp);
            });
        });
    }

    modifyPlanning(pk: number, planning: Planning): Observable<Planning> {
        let url = `${this.backendURL.baseURL}/v1/plannings/${pk}/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPut(url, planning)
            .finally(() => observer.complete())
            .subscribe((planning) => {
                observer.next(planning);
            });
        });
    }
}
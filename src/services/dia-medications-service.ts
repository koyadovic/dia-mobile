import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { DiaAuthService } from './dia-auth-service';
import { UserConfiguration } from '../utils/user-configuration';
import { DiaConfigurationService } from './dia-configuration-service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Medication } from '../models/medications-model';


@Injectable()
export class DiaMedicationsService {

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService) {}

    getUserMedications(): Observable<Medication[]> {
        let url = `${this.backendURL.baseURL}/v1/medications/mine/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((userMedications) => {
                observer.next(userMedications);
            });
        });
    }

    removeUserMedication(id: number) {
        let url = `${this.backendURL.baseURL}/v1/medications/${id}/remove/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, {})
            .finally(() => observer.complete())
            .subscribe((response) => {
                observer.next(response);
            });
        });
    }

    addUserMedication(id: number) {
        let url = `${this.backendURL.baseURL}/v1/medications/${id}/add/`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericPost(url, {})
            .finally(() => observer.complete())
            .subscribe((response) => {
                observer.next(response);
            });
        });
    }

    searchMedications(name: string): Observable<Medication[]> {
        let url = `${this.backendURL.baseURL}/v1/medications/?name=${name}`;
        return Observable.create((observer) => {
            this.restBackendService
            .genericGet(url)
            .finally(() => observer.complete())
            .subscribe((medications) => {
                observer.next(medications);
            });
        });
    }
}
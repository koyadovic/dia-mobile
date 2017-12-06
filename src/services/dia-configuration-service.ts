import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { DiaAuthService } from './dia-auth-service';


@Injectable()
export class DiaConfigurationService {
    private configuration = new ReplaySubject<any>(1);

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService) {
        
        this.authenticationService.loggedIn().subscribe(
            (loggedIn) => {
                if (loggedIn) {
                    this.restBackendService
                        .genericGet(`${this.backendURL.baseURL}/v1/configurations/`)
                        .subscribe((resp) => {
                            this.configuration.next(resp);
                        }
                    );
                }
            }
        );
    }

    saveConfiguration(configurationChanges) {
        this.restBackendService
            .genericPost(`${this.backendURL.baseURL}/v1/configurations/`, configurationChanges)
            .subscribe((resp) => {
            });
    }

    getConfiguration():Observable<any> {
        return this.configuration.asObservable();
    }
}
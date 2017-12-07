import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { DiaAuthService } from './dia-auth-service';
import { Subscription } from 'rxjs';


@Injectable()
export class DiaConfigurationService {
    private configuration = new ReplaySubject<any>(1);
    private subscriptions = [];
    private subscription = new Subscription();

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService) {
        
        let sub = this.authenticationService.loggedIn().subscribe(
            (loggedIn) => {
                if (loggedIn) {
                    this.restBackendService
                        .genericGet(`${this.backendURL.baseURL}/v1/configurations/`)
                        .subscribe((resp) => {
                            this.configuration.next(resp);
                        }
                    );
                } else {
                    this.subscription.unsubscribe();
                }
            }
        );
        this.subscription.add(sub);
    }

    saveConfiguration(configurationChanges) {
        let sub = this.restBackendService
            .genericPost(`${this.backendURL.baseURL}/v1/configurations/`, configurationChanges)
            .subscribe((resp) => {
            });
        
        this.subscription.add(sub);

    }

    getConfiguration():Observable<any> {
        return this.configuration.asObservable();
    }
}
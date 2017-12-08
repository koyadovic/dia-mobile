import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { DiaAuthService } from './dia-auth-service';
import { TranslateService } from '@ngx-translate/core';
import { UserConfiguration } from '../utils/user-configuration';


@Injectable()
export class DiaConfigurationService {
    private configuration = new ReplaySubject<any>(1);
    private userConfig: UserConfiguration;

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService,
                private translate: TranslateService) {
        
        let sub = this.authenticationService.loggedIn().subscribe(
            (loggedIn) => {
                if (loggedIn) {
                    this.refreshConfiguration();
                }
            }
        );
    }

    private refreshConfiguration(){
        this.restBackendService
        .genericGet(`${this.backendURL.baseURL}/v1/configurations/`)
        .subscribe((configuration) => {
            this.configuration.next(configuration);
            this.userConfig = new UserConfiguration(configuration, this.translate);
        }
    );

    }

    saveConfiguration(configurationChanges) {
        return this.restBackendService
            .genericPost(`${this.backendURL.baseURL}/v1/configurations/`, configurationChanges)
            .subscribe((resp) => {
                  this.userConfig.updateValues(configurationChanges);
                  this.refreshConfiguration();
                },
                (error) => {
        
            });
    }

    getConfiguration():Observable<any> {
        return this.configuration.asObservable();
    }
}
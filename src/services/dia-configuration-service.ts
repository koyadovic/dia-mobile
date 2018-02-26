import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { DiaAuthService } from './dia-auth-service';
import { TranslateService } from '@ngx-translate/core';
import { UserConfiguration } from '../utils/user-configuration';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DiaConfigurationService {
    private configuration = new ReplaySubject<any>(1);
    private userConfig: UserConfiguration = new UserConfiguration();

    private ready$ = new BehaviorSubject<boolean>(false);

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService,
                private translate: TranslateService) {
        
        this.authenticationService.loggedIn().subscribe(
            (loggedIn) => {
                if (loggedIn) {
                    this.refreshConfiguration();
                }
            }
        );
    }
    
    saveConfiguration(configurationChanges) {
        return this.restBackendService
            .genericPost(`${this.backendURL.baseURL}/v1/configurations/`, configurationChanges)
            .subscribe((configuration) => {
                this.userConfig.updateValues(configurationChanges);
                this.newConfiguration(configuration);
            });
    }

    private refreshConfiguration(){
        this.restBackendService
            .genericGet(`${this.backendURL.baseURL}/v1/configurations/`)
            .subscribe((configuration) => {
                this.newConfiguration(configuration);
            }
        );
    }

    private newConfiguration(configuration){
        this.configuration.next(configuration);
        this.userConfig.injectDependencies(configuration, this.translate);
        this.ready$.next(true);
    }

    getConfiguration():Observable<any> {
        return this.configuration.asObservable();
    }

    getUserConfiguration(){
        return this.userConfig;
    }

    public isReady(){
        return this.ready$.asObservable();
    }

}
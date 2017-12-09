import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { DiaAuthService } from './dia-auth-service';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable()
export class DiaTimelineService {
    private timeline$ = new ReplaySubject<any>(1);

    constructor(private backendURL: DiaBackendURL,
                private restBackendService: DiaRestBackendService,
                private authenticationService: DiaAuthService) {
        
        let sub = this.authenticationService.loggedIn().subscribe(
            (loggedIn) => {
                if (loggedIn) {
                    this.refreshTimeline();
                }
            }
        );
    }

    refreshTimeline(){
        let url = `${this.backendURL.baseURL}/v1/instants/timeline/`;
        this.restBackendService
            .genericGet(url)
            .subscribe((timeline) => {
                this.timeline$.next(timeline);
            });
    }

    getTimeline():Observable<any>  {
        return this.timeline$.asObservable();
    }

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { DiaConfigurationService } from './dia-configuration-service';
import { DiaAuthService } from './dia-auth-service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class DiaInsightsService {

  constructor(private backendURL: DiaBackendURL,
              private restBackendService: DiaRestBackendService,
              private configurationService: DiaConfigurationService,
              private authenticationService: DiaAuthService,
              private translate: TranslateService) {
  }

  getInsights():Observable<any[]> {
    let url = `${this.backendURL.baseURL}/v1/insights/`;
    return Observable.create((observer) => {
        this.restBackendService
        .genericGet(url)
        .finally(() => observer.complete())
        .subscribe((insights) => {
            observer.next(insights);
        });
    });
  }

  getConcreteInsight(url:string):Observable<any> {
    return Observable.create((observer) => {
      this.restBackendService
      .genericGet(url)
      .finally(() => observer.complete())
      .subscribe((insight) => {
          observer.next(insight);
      });
    });
  }

  requestReport():Observable<any> {
    let url = `${this.backendURL.baseURL}/v1/insights/report/`;
    return Observable.create((observer) => {
      this.restBackendService
      .genericPost(url, {})
      .finally(() => observer.complete())
      .subscribe(
        (resp) => {
          observer.next(resp);
        },
        (err) => {
          observer.error(err)
        });
    });
  }

}

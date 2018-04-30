import { Injectable } from '@angular/core';
import { DiaConfigurationService } from './dia-configuration-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { UserConfiguration } from '../utils/user-configuration';


@Injectable()
export class TimezoneGuardService {
  private changed$ = new BehaviorSubject<boolean>(false);
  private currentTimezone:string = '';
  private newTimezone: string = '';

  constructor(public configService: DiaConfigurationService,
              public backendURL: DiaBackendURL,
              public restBackendService: DiaRestBackendService) {

    this.checkIfTimezoneChanged();
  }

  public getChanged(){
    return this.changed$.asObservable();
  }

  private checkIfTimezoneChanged(){
    this.configService.isReady().subscribe(
      (ready) => {
        if(ready) {
          this.currentTimezone = this.configService.getUserConfiguration().getValue(UserConfiguration.TIMEZONE);
          this.newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          let hasChanged = this.newTimezone !== this.currentTimezone;

          if(hasChanged) {
            this.changed$.next(true);
          }
        }
      }
    );
  }

  getCurrentTimezone(){
    return this.currentTimezone;
  }

  getNewTimezone() {
    return this.newTimezone;
  }

  getAvailableCountries():Observable<any[]> {
    // this query to the backend about the available countries for it is configured to.
    let url = `${this.backendURL.baseURL}/v1/configurations/available-countries/`;
    return Observable.create((observer) => {
      this.restBackendService.genericGet(url).finally(() => observer.complete()).subscribe((resp) => {
          observer.next(resp);
      });
    });
  }

  getCountry(timezone:string):Observable<any[]> {
    // timezone example could be "Europe/Madrid"
    // it will return the country information about this timezone
    timezone = timezone.replace('/', '-');
    let url = `${this.backendURL.baseURL}/v1/configurations/country/${timezone}/`;
    return Observable.create((observer) => {
      this.restBackendService.genericGet(url).finally(() => observer.complete()).subscribe((resp) => {
          observer.next(resp);
      });
    });
  }

  getTimezones(countryCode:string):Observable<any[]> {
    // country code is the two character ISO 3166-1 alfa-2 code for the country
    // will be returned the list of timezones of this country in the form:
    // [{'display': 'Timezone Name', 'value': 'Timezone value'}, ...]
    let url = `${this.backendURL.baseURL}/v1/configurations/timezones/${countryCode}/`;
    return Observable.create((observer) => {
      if(countryCode.length !== 2) {
        observer.next([]);
        observer.complete();
      } else {
        this.restBackendService.genericGet(url).finally(() => observer.complete()).subscribe((resp) => {
          observer.next(resp);
        });
      }
    });
  }
}

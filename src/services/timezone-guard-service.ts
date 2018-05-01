import { Injectable } from '@angular/core';
import { DiaConfigurationService } from './dia-configuration-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaRestBackendService } from './dia-rest-backend-service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { UserConfiguration } from '../utils/user-configuration';
import { Geolocation } from '@ionic-native/geolocation';


@Injectable()
export class TimezoneGuardService {
  private changed$ = new BehaviorSubject<boolean>(false);
  private ready$ = new BehaviorSubject<boolean>(false);

  private lastTimezone:string = '';
  private newTimezone: string = '';
  private newGPSInfo = {};

  constructor(public configService: DiaConfigurationService,
              public backendURL: DiaBackendURL,
              public restBackendService: DiaRestBackendService,
              public geolocation: Geolocation) {

    this.checkIfTimezoneChanged();
  }

  public getChanged(){
    return this.changed$.asObservable();
  }
  public getReady(){
    return this.ready$.asObservable();
  }

  private checkIfTimezoneChanged(){
    this.configService.isReady().subscribe(
      (ready) => {
        if(ready) {
          this.geolocation.getCurrentPosition().then((resp) => {
            console.log("GPS response: " + JSON.stringify(resp));
            this.getGPSCoordinatesInfo(resp.coords.latitude, resp.coords.longitude).subscribe(
              (info) => {
                /*
                {
                    "timezone": "Europe/Madrid",
                    "gps": {
                        "latitude": 40.4478587,
                        "longitude": -3.6654879
                    },
                    "country": {
                        "code": "ES",
                        "name": "Spain"
                    }
                }
                */
                this.newGPSInfo = info;
                this.lastTimezone = this.configService.getUserConfiguration().getValue(UserConfiguration.TIMEZONE);
                this.newTimezone = info['timezone'];
    
                let hasChanged = !!this.newTimezone && this.newTimezone !== this.lastTimezone;
                if(hasChanged) {
                  console.log("tz changed!, old: " + this.lastTimezone + ", new: " + this.newTimezone);
                  this.changed$.next(true);
                }

                this.ready$.next(true);
              }
            );
          }).catch((error) => {
            console.log('Error getting location', error);
          });

        }
      }
    );
  }

  getCurrentTimezone(){
    return this.lastTimezone;
  }

  getNewTimezone() {
    return this.newTimezone;
  }

  getNewGPSInfo() {
    return this.newGPSInfo;
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

  getGPSCoordinatesInfo(latitude:number, longitude:number):Observable<any[]> {
    // this query to the backend about the available countries for it is configured to.
    let url = `${this.backendURL.baseURL}/v1/utils/gps-info/${latitude}/${longitude}/`;
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
    let url = `${this.backendURL.baseURL}/v1/utils/timezones/${countryCode}/`;
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

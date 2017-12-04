import { Http, Headers } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/catch';


/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestBackendService {
  private apiBaseURLDevelopment = 'http://127.0.0.1:8000';
  private apiBaseURLProduction = 'https://api.diamobile.com';
  private apiBaseURL = this.apiBaseURLDevelopment;
  //private apiBaseURL = this.apiBaseURLProduction;

  private token = new Subject<any>();

  public configuration = null;
  
  constructor(
    public http: Http,
    private storage: Storage
  ) {
    this.storage.get('token').then((token) => {
      this.token.next(token);
    });

    this.refreshConfiguration();
  }

  login(email:string, password:string) {
    let data = {"email": email, "password": password};
    return this.genericPost(`${this.apiBaseURL}/v1/accounts/tokens/`, data);
  }

  saveConfiguration(configurationChanges) {
    this.genericPost(`${this.apiBaseURL}/v1/configurations/`, configurationChanges).subscribe(
      (resp) => {
        
      }
    );
  }

  refreshConfiguration() {
      this.genericGet(`${this.apiBaseURL}/v1/configurations/`).subscribe(
        (resp) => {
          this.configuration = resp;
        }
      );
  }

  private getHeaders(token: string) {
    let headers = new Headers();
    headers.append("Authorization",`Token ${token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private genericGet(url: string){
    return Observable.create((observer) => {
      this.token.subscribe(
        (token) => {
          this.http.get(url, {headers: this.getHeaders(token)}).subscribe(
            (resp) => {
              observer.next(resp.json());
            },
            this.handleErrors
          );
        }
      )
    });
  }

  private genericPost(url: string, data: object) {
    return Observable.create(
      (observer) => {
        this.token.subscribe(
          (token) => {
            this.http.post(url, data, {headers: this.getHeaders(token)}).subscribe(
              (resp) => {
                observer.next(resp.json());
              },
              this.handleErrors
            )
          }
        )
      }
    );
  }

  private handleErrors(error) {

  }
}

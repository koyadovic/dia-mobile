import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

  private token = "";

  public configuration = null;

  constructor(
    public http: Http,
    private storage: Storage
  ) {
    this.refreshConfiguration();
  }

  login(email:string, password:string) {
    return this.http.post(`${this.apiBaseURL}/v1/accounts/tokens/`, {
      "email": email,
      "password": password
    });
  }

  saveConfiguration(configurationChanges) {
    console.log("Saving configuration:");
    console.log(configurationChanges);
    return this.http.post(`${this.apiBaseURL}/v1/configurations/`, configurationChanges, {headers: this.getHeaders()});
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append("Authorization",`Token ${this.token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  refreshConfiguration() {
    this.storage.get('token').then((token) => {
      this.token = token;
      this.http.get(`${this.apiBaseURL}/v1/configurations/`, {headers: this.getHeaders()}).subscribe(
        (resp) => {
          this.configuration = resp.json();
        },
        (err) => {
          this.storage.set('token', '');
        }
      );
    });
  }

}

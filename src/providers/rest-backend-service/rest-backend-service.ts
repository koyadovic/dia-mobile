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

  constructor(
    public http: Http,
    private storage: Storage
  ) {}

  
  private getHeaders() {
    let token = this.storage.get('token');

    let headers = new Headers();
    headers.append("Authorization",`Token ${token}`);
    headers.append('Content-Type', 'application/json');

    return headers;
  }
  

  login(email:string, password:string) {
    return this.http.post(`${this.apiBaseURL}/v1/accounts/tokens/`, {
      "email": email,
      "password": password
    });
  }

  getConfiguration() {
    return this.http.get(`${this.apiBaseURL}/v1/configurations/`, {headers: this.getHeaders()});
  }

}

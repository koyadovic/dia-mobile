import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';


/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  private apiBaseURLDevelopment = 'http://127.0.0.1:8000';
  private apiBaseURLProduction = 'http://127.0.0.1:8000';

  private apiBaseURL = this.apiBaseURLDevelopment;
  //private apiBaseURL = this.apiBaseURLProduction;

  constructor(public http: Http) {
    
  }

  login(email:string, password:string) {
    return this.http.post(`${this.apiBaseURL}/api/v1/accounts/token/`, {
      "email": email,
      "password": password
    });
  }

}

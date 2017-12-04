import { Http, Headers } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/catch';
import { AlertController } from 'ionic-angular';


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

  private token = new ReplaySubject<any>();
  public configuration = new ReplaySubject<any>();
  
  constructor(
    public http: Http,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
    this.storage.get('token').then((token) => {
      this.token.next(token);
    });

    this.refreshConfiguration();
  }

  login(email:string, password:string) {
    let url = `${this.apiBaseURL}/v1/accounts/tokens/`;
    let data = {"email": email, "password": password};

    let result = Observable.create((observer) => {
      this.http.post(url, data).subscribe(
          (resp) => {
            // store the access token
            this.storage.set("token", resp.json()["token"]);
            observer.next(true);
          },
          (err) => {
            observer.next(false);
          }
        )
      });
    
    return result;
  }

  saveConfiguration(configurationChanges) {
    this.genericPost(`${this.apiBaseURL}/v1/configurations/`, configurationChanges).subscribe((resp) => {});
  }

  private refreshConfiguration() {
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
            (err) => {
              let alert;
              if (err.error instanceof Error) {
                alert = this.alertCtrl.create({
                  title: 'Client Side Error',
                  subTitle: err.error.message,
                  buttons: ['OK']
                });
              } else {
                alert = this.alertCtrl.create({
                  title: 'Server Side Error',
                  subTitle: `Backend returned code ${err.status}, body was: ${err.error}`,
                  buttons: ['OK']
                });
              }
              alert.present();
            }
          );
        }
      )
    });
  }

  private genericPost(url: string, data: object) {
    return Observable.create((observer) => {
        this.token.subscribe(
          (token) => {
            this.http.post(url, data, {headers: this.getHeaders(token)}).subscribe(
              (resp) => {
                observer.next(resp.json());
              },
              (err) => {
                let alert;
                if (err.error instanceof Error) {
                  alert = this.alertCtrl.create({
                    title: 'Client Side Error',
                    subTitle: err.error.message,
                    buttons: ['OK']
                  });
                } else {
                  alert = this.alertCtrl.create({
                    title: 'Server Side Error',
                    subTitle: `Backend returned code ${err.status}, body was: ${err.error}`,
                    buttons: ['OK']
                  });
                }
                alert.present();
              }
            );
          }
        );
      }
    );
  }

}

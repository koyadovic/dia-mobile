import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaAppState } from './dia-app-state';
import { DiaMessage } from '../models/messages-model';


@Injectable()
export class RestBackendService {

  constructor(private http: Http,
              private authService: DiaAuthService,
              private backendURL: DiaBackendURL,
              private appState: DiaAppState) {

    //this.authService.isLoggedIn().subscribe(loggedIn => { if (loggedIn) this.refreshConfiguration() });
  }

  private getHeaders(token: string) {
    let headers = new Headers();
    headers.append("Authorization",`Token ${token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  public genericGet(url: string){
    return Observable.create((observer) => {
      this.authService.token().subscribe(
        (token) => {
          this.http.get(url, {headers: this.getHeaders(token)}).subscribe(
            (resp) => {
              observer.next(resp.json());
            },
            (err) => {
              let message = new DiaMessage("Client side error", "error", err.error.message);
              this.appState.publishMessage(message);
            }
          );
        }
      )
    });
  }

  public genericPost(url: string, data: object) {
    return Observable.create((observer) => {
      this.authService.token().subscribe(
        (token) => {
          this.http.post(url, data, {headers: this.getHeaders(token)}).subscribe(
            (resp) => {
              observer.next(resp.json());
            },
            (err) => {
              this.appState.publishMessage(new DiaMessage(
                "Server side error", "error", `Backend returned code ${err.status}, body was: ${err.error}`
              ));
            }
          );
        }
      );
    });
  }
}

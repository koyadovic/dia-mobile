import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaMessageService } from './dia-message-service';
import { DiaMessage } from '../models/messages-model';


@Injectable()
export class DiaRestBackendService {

  constructor(private http: Http,
              private authService: DiaAuthService,
              private backendURL: DiaBackendURL,
              private messageServices: DiaMessageService) { }

  private getHeaders(token: string) {
    let headers = new Headers();
    headers.append("Authorization",`Token ${token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  public genericGet(url: string){
    return Observable.create((observer) => {
      this.authService.token().filter((token) => token !== "" && token !== undefined).subscribe(
        (token) => {
          this.http.get(url, {headers: this.getHeaders(token)}).subscribe(
            (resp) => {
              observer.next(resp.json());
            },
            (err) => {
              let message = new DiaMessage("Client side error", "error", err.error.message);
              this.messageServices.publishMessage(message);
            }
          );
        }
      )
    });
  }

  public genericPost(url: string, data: object) {
    return Observable.create((observer) => {
      this.authService.token().filter((token) => token !== "" && token !== undefined).subscribe(
        (token) => {
          this.http.post(url, data, {headers: this.getHeaders(token)}).subscribe(
            (resp) => {
              observer.next(resp.json());
            },
            (err) => {
              this.messageServices.publishMessage(new DiaMessage(
                "Server side error", "error", `Backend returned code ${err.status}, body was: ${err.error}`
              ));
            }
          );
        }
      );
    });
  }
}

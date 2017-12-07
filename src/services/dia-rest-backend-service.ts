import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaMessageService } from './dia-message-service';


@Injectable()
export class DiaRestBackendService {

  constructor(private http: Http,
              private authService: DiaAuthService,
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
              this.messageServices.errorMessage("Client Side Error", err);
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
              this.messageServices.errorMessage(
                "Server side error",
                `Backend returned code ${err.status}, body was: ${err}`
              );
            }
          );
        }
      );
    });
  }
}

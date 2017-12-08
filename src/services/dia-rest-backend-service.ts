import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';


@Injectable()
export class DiaRestBackendService {

  constructor(private http: Http,
              private authService: DiaAuthService) { }

  private getHeaders(token: string) {
    let headers = new Headers();
    headers.append("Authorization",`Token ${token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  public genericGet(url: string){
    return Observable.create((observer) => {
      this.http.get(url, {headers: this.getHeaders(this.authService.getToken())})
      .map((response) => {
        if (response.status == 401) {
          this.authService.logout();
        }
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp.json());
        },
        (err) => {
        }
      );
    });
  }

  public genericPost(url: string, data: object) {
    return Observable.create((observer) => {
      this.http.post(url, data, {headers: this.getHeaders(this.authService.getToken())})
      .map((response) => {
        if (response.status == 401) {
          this.authService.logout();
        }
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp.json());
        },
        (err) => {
        }
      );
    });
  }
}

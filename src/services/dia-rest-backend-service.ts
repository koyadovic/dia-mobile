import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';
import { HttpResponse } from '@angular/common/http';


@Injectable()
export class DiaRestBackendService {

  constructor(private http: HttpClient,
              private authService: DiaAuthService) { }

  private getHeaders(token: string) {
    let headers = new HttpHeaders({
      "Authorization":`token ${token}`,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  public genericGet(url: string): Observable<any> {
    return Observable.create((observer) => {
      this.http.get(url, {headers: this.getHeaders(this.authService.getToken())})
      .map((response: HttpResponse<any>) => {
        if (response.status == 401) {
          this.authService.logout();
        }
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
          observer.complete();
        },
        (err) => {
        }
      );
    });
  }

  public genericPost(url: string, data: object): Observable<any> {
    return Observable.create((observer) => {
      this.http.post(url, data, {headers: this.getHeaders(this.authService.getToken())})
      .map((response: HttpResponse<any>) => {
        if (response.status == 401) {
          this.authService.logout();
        }
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
          observer.complete();
        },
        (err) => {
        }
      );
    });
  }

}

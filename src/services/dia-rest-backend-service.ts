import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DiaAuthService } from './dia-auth-service';
import { HttpResponse } from '@angular/common/http';


@Injectable()
export class DiaRestBackendService {

  constructor(private http: HttpClient,
              private authService: DiaAuthService) {}

  private getHeaders(token: string) {
    let headers = new HttpHeaders({
      "Authorization":`token ${token}`,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  public genericGet(url: string): Observable<any> {
    return Observable.create((observer) => {
      this.http
      .get(url, {headers: this.getHeaders(this.authService.getToken())})
      .finally(() => observer.complete())
      .map((response: HttpResponse<any>) => {
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
        },
        (err) => {
          console.log(err);
          if(err.status === 401){
            this.authService.logout();
          }
        }
      );
    });
  }

  public genericPost(url: string, data: object): Observable<any> {
    return Observable.create((observer) => {
      this.http
      .post(url, data, {headers: this.getHeaders(this.authService.getToken())})
      .finally(() => observer.complete())
      .map((response: HttpResponse<any>) => {
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
        },
        (err) => {
          console.log(err);
          if(err.status === 401){
            this.authService.logout();
          }
        }
      );
    });
  }

  public genericPut(url: string, data: object): Observable<any> {
    return Observable.create((observer) => {
      this.http
      .put(url, data, {headers: this.getHeaders(this.authService.getToken())})
      .finally(() => observer.complete())
      .map((response: HttpResponse<any>) => {
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
        },
        (err) => {
          console.log(err);
          if(err.status === 401){
            this.authService.logout();
          }
        }
      );
    });
  }

  public genericDelete(url: string): Observable<any> {
    return Observable.create((observer) => {
      this.http
      .delete(url, {headers: this.getHeaders(this.authService.getToken())})
      .finally(() => observer.complete())
      .map((response: HttpResponse<any>) => {
        return response;
      })
      .subscribe(
        (resp) => {
          observer.next(resp);
        },
        (err) => {
          console.log(err);
          if(err.status === 401){
            this.authService.logout();
          }
        }
      );
    });
  }


}

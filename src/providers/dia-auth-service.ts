import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
import { DiaBackendURL } from './dia-backend-urls';


@Injectable()
export class DiaAuthService {
    private token$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor(private http: Http,
                private storage: Storage,
                private backendURL: DiaBackendURL) {

        this.storage.get("token").then(token => {
            this.token$.next(token);
        });
        this.token$.subscribe((token) => {
            this.storage.get("token").then(oldtoken => {
                if (oldtoken !== token) {
                    this.storage.set("token", token);
                }
            });
        });
    }

    token() {
        return this.token$.asObservable();
    }

    isLoggedIn(): Observable<boolean>{
        return Observable.create((observer) => {
            this.token$.subscribe((token) => {
                observer.next(token !== "" && token !== undefined);
            })
        })
    }

    login(data: {email: string, password: string}): Observable<boolean> {
        let url = `${this.backendURL.baseURL}/v1/accounts/tokens/`;
    
        let result = Observable.create((observer) => {
          this.http
              .post(url, data)
              .retry()
              .map((resp) => resp.json()["token"])
              .subscribe(
                (token) => {
                    this.token$.next(token);
                    return true;
                },
                (err) => {
                    return false;
                }
              )
          });
        return result;
    }

    logout(){ this.token$.next(""); }

}
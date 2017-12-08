import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
import { DiaBackendURL } from './dia-backend-urls';
import { observeOn } from 'rxjs/operator/observeOn';


@Injectable()
export class DiaAuthService {
    private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private token: string = "";

    constructor(private http: Http,
                private storage: Storage,
                private backendURL: DiaBackendURL) {

        // in startup time we retrieve the token from the store.
        this.storage.get("token").then(token => {
            console.log("Auth OK - Token: \'" + token + "\', loggedIn: " + !!token);
            this.token = token;
            this.loggedIn$.next(!!token);
        });
    }

    // return only observable versions of the subject
    loggedIn(): Observable<boolean> { return this.loggedIn$.asObservable(); }

    getToken(){
        return this.token;
    }

    login(data: {email: string, password: string}) {
        let url = `${this.backendURL.baseURL}/v1/accounts/tokens/`;
    
        this.http.post(url, data)
                 .map((resp) => resp.json()["token"])
                 .subscribe(
                    (token) => {
                        console.log("Auth OK - Token: \'" + token + "\', loggedIn: " + !!token);
                        this.token = token;
                        this.loggedIn$.next(!!token);
                    },
                    (err) => {
                        console.log("Auth ERR - Token: \'\', loggedIn: " + false);
                        this.token = "";
                        this.loggedIn$.next(false);
                    }
                )
    }

    logout(){
        console.log("Auth OK - Token: \'\', loggedIn: " + false);
        this.storage.set("token", "");
        this.loggedIn$.next(false);
    }
}
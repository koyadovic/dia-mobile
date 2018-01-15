import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DiaBackendURL } from './dia-backend-urls';
import { observeOn } from 'rxjs/operator/observeOn';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DiaAuthService {
    private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private token: string = "";

    constructor(private http: HttpClient,
                private storage: Storage,
                private backendURL: DiaBackendURL) {

        // in startup time we retrieve the token from the store.
        this.storage.get("token").then(token => {
            this.token = token;
            if(this.loggedIn$.getValue() !== !!token)
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
                 .map((resp) => resp["token"])
                 .subscribe(
                    (token) => {
                        this.storage.set("token", token);
                        this.storage.set("email", data.email);
                        this.token = token;
                        this.loggedIn$.next(!!token);
                    },
                    (err) => {
                        this.logout();
                    }
                )
    }

    logout(){
        this.storage.set("token", "");
        this.storage.set("email", "");
        this.token = '';
        this.loggedIn$.next(false);
    }
}
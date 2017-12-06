import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaMessageService } from './dia-message-service';
import { observeOn } from 'rxjs/operator/observeOn';


@Injectable()
export class DiaAuthService {
    private token$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: Http,
                private storage: Storage,
                private messageService: DiaMessageService,
                private backendURL: DiaBackendURL) {

        // in startup time we retrieve the token from the store.
        this.storage.get("token").then(token => {
            this.token$.next(token);
        });

        // on token changes
        this.token$.subscribe((token) => {
            // update loggedIn value
            let logged = token !== "" && token !== undefined;
            this.loggedIn$.next(logged); 

            // this ensures that every change in the token, if distinct, will be saved
            this.storage.get("token").then(oldtoken => {
                let currentToken = this.token$.getValue();
                if (oldtoken !== currentToken) {
                    this.storage.set("token", currentToken);
                }
            });
        });
    }

    // return only observable versions of our subjects
    token(): Observable<string> { return this.token$.asObservable(); }
    loggedIn(): Observable<boolean> { return this.loggedIn$.asObservable(); }

    login(data: {email: string, password: string}) {
        let url = `${this.backendURL.baseURL}/v1/accounts/tokens/`;
    
        this.http.post(url, data)
                 .map((resp) => resp.json()["token"])
                 .subscribe(
                    (token) => {
                        this.token$.next(token);
                    },
                    (err) => {
                        this.messageService.errorMessage("Auth Error", "The authentication went bad. :-(")
                    }
                )
    }

    logout(){ this.token$.next(""); }

}
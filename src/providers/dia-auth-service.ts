import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaMessageService } from './dia-message-service';
import { DiaMessage } from '../models/messages-model';
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
            this.loggedIn$.next(token !== "" && token !== undefined); 

            // this ensures that every change in the token, if distinct, will be saved
            this.storage.get("token").then(oldtoken => {
                if (oldtoken !== token) {
                    this.storage.set("token", token);
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
                        this.messageService.publishMessage(
                            new DiaMessage("Auth Error", "error", "The authentication went bad. :-(")
                        );
                    }
                )
    }

    logout(){
        this.messageService.publishMessage(
            new DiaMessage("Logout", "success", "Session was closed successfully.")
        );
        this.loggedIn$.next(false);
        this.token$.next(""); 
    }

}
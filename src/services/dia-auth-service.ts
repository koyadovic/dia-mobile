import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DiaBackendURL } from './dia-backend-urls';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { DiaMessageService } from './dia-message-service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Injectable()
export class DiaAuthService {
    private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private token: string = "";
    public groups = [];

    constructor(private http: HttpClient,
                private storage: Storage,
                public events: Events,
                private translate: TranslateService,
                private messageService: DiaMessageService,
                private backendURL: DiaBackendURL) {

        // in startup time we retrieve the token from the store.
        this.storage.get("token").then(token => {
            this.token = token;
            if(this.loggedIn$.getValue() !== !!token)
                this.loggedIn$.next(!!token);
        });

        // here we get user groups
        this.loggedIn().subscribe(loggedIn => {
            if(loggedIn) {
                this.refreshGroups();
            } else {
                this.groups = [];
            }
        });

        // if there are changes in medications, we need to reload groups
        this.events.subscribe('medications:medications-change', () =>  {
            this.refreshGroups();
        });
    }

    refreshGroups() {
        let headers = new HttpHeaders({
            "Authorization":`token ${this.token}`,
            'Content-Type': 'application/json'
        });

        let url = `${this.backendURL.baseURL}/v1/accounts/self/`;

        this.http.get(url, {headers: headers})
                    .map((response: HttpResponse<any>) => { return response['groups']; })
                    .subscribe(
                        resp => this.groups = resp,
                        err => console.error(err)
                    );
    }

    isDiabetic(): boolean {
        return this.groups.indexOf('Diabetics') > -1;
    }

    isDietAndExercise(): boolean {
        return this.groups.indexOf('Diet & Exercise') > -1;
    }

    // return only observable versions of the subject
    loggedIn(): Observable<boolean> { return this.loggedIn$.asObservable(); }

    getToken(){
        return this.token;
    }

    login(data: {email: string, password: string}) {
        let url = `${this.backendURL.baseURL}/v1/accounts/tokens/`;

        forkJoin(
            this.translate.get('It seems there are network problems. Check your Internet connection.'),
            this.translate.get('We were unable to log in with the email and/or password provided.'),
            this.translate.get('Unexpected error.')
        ).subscribe(([networkError, credentialsError, unexpectedError]) => {
            this.http.post(url, data)
            .map((resp) => resp["token"])
            .subscribe(
               (token) => {
                   this.storage.set("token", token);
                   this.storage.set("email", data.email);
                   this.token = token;
                   this.loggedIn$.next(!!token);

                   setTimeout(() => {
                      this.translate.get('Session started correctly. Our most sincere welcome!').subscribe((mess) => {
                        this.messageService.toastMessage(mess);
                      });
                   }, 1000);
                },
               (err) => {
                   if (err.status === 0) {
                       // without connection
                       this.messageService.toastMessage(networkError);
                   }
                   else if (err.status === 400) {
                       // bad credentials
                       this.messageService.toastMessage(credentialsError);
                   } else {
                       // unexpected error
                       this.messageService.toastMessage(unexpectedError);
                   }
               }
           );
        });
    }

    logout(){
        setTimeout(() => {
            document.location.href = '';
        }, 400);

        this.groups = [];
        this.storage.set("token", "");
        this.storage.set("email", "");
        this.token = '';
        this.loggedIn$.next(false);
    }
}
import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { DiaAuthService } from './dia-auth-service';
import { DiaBackendURL } from './dia-backend-urls';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DiaWebsocketService {
    private token$: Observable<string>;
    private websocket: WebSocket;
    private messages: Subject<MessageEvent>;

    private ready$ = new BehaviorSubject<boolean>(false);
    
    constructor(private authenticationService: DiaAuthService,
                private backendURLs: DiaBackendURL) {
        
        this.authenticationService.loggedIn().subscribe((loggedIn) => {
            if(loggedIn) {
                if (!!this.websocket && ! this.websocket.CLOSED)
                    this.websocket.close();

                let token = this.authenticationService.getToken();
                this.websocket = new WebSocket(backendURLs.wsBaseURL + `?t=${token}`);

                let observable = Observable.create((observer) => {
                    this.websocket.onmessage = observer.next.bind(observer);
                    this.websocket.onerror = observer.error.bind(observer);
                    this.websocket.onclose = observer.complete.bind(observer);
                    return this.websocket.close.bind(this.websocket);
                });

                let observer = {
                    next: (data: Object) => {
                        if (this.websocket.readyState === WebSocket.OPEN) {
                            this.websocket.send(JSON.stringify(data));
                        }
                    }
                };

                this.messages = Subject.create(observer, observable);
                this.ready$.next(true);

            } else {
                // token === "" means logout
                if(this.websocket)
                this.websocket.close();
                this.ready$.next(false);

            }
        })
    }

    public ready(){
        return this.ready$;
    }

    public getMessages(){
        return this.messages;
    }

}
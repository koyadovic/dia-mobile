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

    private reconnectionInterval = null;

    private ready$ = new BehaviorSubject<boolean>(false);
    private loggedIn: boolean;
    
    constructor(private authenticationService: DiaAuthService,
                private backendURLs: DiaBackendURL) {
        
        this.authenticationService.loggedIn().subscribe((loggedIn) => {
            this.loggedIn = loggedIn;

            if(this.loggedIn) {
                this.checkConnectionStatusAndReconnect();
            } else {
                if (!!this.websocket) this.websocket.close();
            }
        });

        
        this.reconnectionInterval = setInterval(this.checkConnectionStatusAndReconnect.bind(this), 10000);

    }

    private checkConnectionStatusAndReconnect() {
        if (this.loggedIn === null || this.loggedIn === false) {
            this.ready$.next(false);
            return;
        }

        if(!this.websocket || this.websocket.readyState === WebSocket.CLOSED || this.websocket.readyState === WebSocket.CLOSING) {
            this.configureMessagesAndConnection();
        }
    }

    private configureMessagesAndConnection() {
        if (!!this.websocket && this.websocket.readyState !== this.websocket.CLOSED)
            this.websocket.close();

        let token = this.authenticationService.getToken();
        this.websocket = new WebSocket(this.backendURLs.wsBaseURL + `?t=${token}`);

        let observable = Observable.create((observer) => {
            this.websocket.onmessage = observer.next.bind(observer);
            this.websocket.onerror = observer.error.bind(observer);
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
    }

    public isReady(){
        return this.ready$.asObservable();
    }

    public getMessages(){
        return this.messages.asObservable();
    }
}
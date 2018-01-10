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
    
    constructor(private authenticationService: DiaAuthService,
                private backendURLs: DiaBackendURL) {
        
        this.authenticationService.loggedIn().subscribe((loggedIn) => {
            if(loggedIn === null) return;

            if(loggedIn) {
                this.configureMessagesAndConnection();
            } else {
                if(this.websocket) this.websocket.close();
                if (this.reconnectionInterval !== null) {
                    clearInterval(this.reconnectionInterval);
                }
            }
        });
    }

    private checkConnectionStatusAndReconnect() {
        let token = this.authenticationService.getToken();
        if(!token) return;

        if(this.websocket.readyState === WebSocket.CLOSED || this.websocket.readyState === WebSocket.CLOSING) {
            this.configureMessagesAndConnection();
        }
        if(this.websocket.readyState === WebSocket.CLOSED || this.websocket.readyState === WebSocket.CLOSING || this.websocket.readyState === WebSocket.CONNECTING) {
            if (this.reconnectionInterval === null)
                this.reconnectionInterval = setInterval(this.checkConnectionStatusAndReconnect.bind(this), 10000);
        } else {
            if (this.reconnectionInterval !== null) {
                clearInterval(this.reconnectionInterval);
                this.reconnectionInterval = null;
            }
        }
    }

    private configureMessagesAndConnection() {
        if (!!this.websocket && ! this.websocket.CLOSED)
            this.websocket.close();

        let token = this.authenticationService.getToken();
        this.websocket = new WebSocket(this.backendURLs.wsBaseURL + `?t=${token}`);

        let observable = Observable.create((observer) => {
            this.websocket.onmessage = observer.next.bind(observer);
            this.websocket.onerror = observer.error.bind(observer);

            this.websocket.onclose = (event) => {
                setTimeout(this.checkConnectionStatusAndReconnect.bind(this), 10000);
            };
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
    }

    public getMessages(){
        return this.messages.asObservable();
    }
}
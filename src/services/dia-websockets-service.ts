import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { DiaAuthService } from './dia-auth-service';
import { DiaBackendURL } from './dia-backend-urls';


@Injectable()
export class DiaWebsocketService {
    private token$: Observable<string>;
    private websocket: WebSocket;
    private messages: Subject<MessageEvent>;
    
    constructor(private authenticationService: DiaAuthService,
                private backendURLs: DiaBackendURL) {
        
        this.token$ = this.authenticationService.token();

        this.token$.subscribe((token) => {
            // token !== "" means login so we connect websocket
            if(token !== "" && token !== undefined) {
                if (this.websocket && ! this.websocket.CLOSED)
                    this.websocket.close();

                this.websocket = new WebSocket(backendURLs.wsBaseURL);

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

            } else {
                // token === "" means logout
                this.websocket.close();
            }
        })
    }

    public getMessages(){
        return this.messages.asObservable();
    }

}
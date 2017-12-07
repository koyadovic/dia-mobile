import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DiaMessage } from '../models/messages-model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Observable } from 'rxjs/Observable';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { DiaWebsocketService } from './dia-websockets-service';
import { DiaBackendURL } from './dia-backend-urls';
import { DiaAuthService } from './dia-auth-service';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class DiaMessageService {
    private _messages: Subject<DiaMessage> = new Subject<DiaMessage>();

    private _backendMessages: Observable<any>;

    constructor(private alertCtrl: AlertController,
                private backendURLs: DiaBackendURL) {

        this._messages.subscribe((message: DiaMessage) => {
            if (message !== undefined) {
                let alert = this.alertCtrl.create({
                    title: message.title,
                    subTitle: message.message,
                    buttons: ['OK']
                });
                alert.present();
            }
        });
    }

    publishMessage(newMessage: DiaMessage) {
        this._messages.next(newMessage);
    }

    confirmMessage(newMessage: DiaMessage): Observable<boolean> {
        return Observable.create((observer) => {
            let alert = this.alertCtrl.create({
                title: newMessage.title,
                message: newMessage.message,
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            observer.next(false);
                        }
                    },
                    {
                        text: 'OK',
                        handler: () => {
                            observer.next(true);
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    // shortcuts
    infoMessage(title: string, message: string) {
        this.publishMessage(new DiaMessage(title, "info", message));
    }

    warningMessage(title: string, message: string) {
        this.publishMessage(new DiaMessage(title, "warning", message));
    }

    errorMessage(title: string, message: string) {
        this.publishMessage(new DiaMessage(title, "error", message));
    }
}

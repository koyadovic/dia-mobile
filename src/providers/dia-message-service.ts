import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DiaMessage } from '../models/messages-model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class DiaMessageService {
    private _messages: Subject<DiaMessage> = new Subject<DiaMessage>();

    constructor(private alertCtrl: AlertController) {

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

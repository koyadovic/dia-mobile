import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DiaMessage } from '../models/messages-model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


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
}

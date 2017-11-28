import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";
  working: boolean = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private restProvider: RestProvider
  ) {}

  tryLogin(){
    this.working = true;
    let e = this.email;
    let p = this.password;

    this.password = "";

    this.restProvider.login(e, p).subscribe(

      (resp) => {
        this.working = false;
        this.storage.set("token", resp.json()["token"]);
      },

      (err) => {
        this.working = false;
        console.log("Error: " + JSON.stringify(err));
      }

    )
  }
}

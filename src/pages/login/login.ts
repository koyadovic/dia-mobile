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
  ) {

  }

  tryLogin(){
    this.working = true;
    let e = this.email;
    let p = this.password;

    this.email = "";
    this.password = "";

    console.log("Trying login with: " + e + " / " + p);
    this.restProvider.login(this.email, this.password).subscribe(
      (resp) => {
        this.working = false;
        console.log("Ok!: " + resp);
      },
      (err) => {
        this.working = false;
        console.log("Err!: " + err);
      }
    )
      
  }

}

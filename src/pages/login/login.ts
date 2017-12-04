import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { RestBackendService } from '../../providers/rest-backend-service/rest-backend-service';
import { TabsPage } from '../tabs/tabs';

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
    private restService: RestBackendService
  ) {}

  tryLogin(){
    this.working = true;
    let e = this.email;
    let p = this.password;

    this.password = "";

    this.restService.login(e, p).subscribe(
      (success) => {
        if (success) {
          this.working = false;
          // navigate to TabsPage avoiding back to this login page
          this.navCtrl.push(TabsPage).then(() => {
            let index = this.navCtrl.getActive().index;
            this.navCtrl.remove(index - 1);
          });
        } else {
          this.working = false;
          // invalid password
        }
      }
    )
  }
}

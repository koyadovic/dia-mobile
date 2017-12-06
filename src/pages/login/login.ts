import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { DiaAuthService } from '../../providers/dia-auth-service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";
  working: boolean = false;

  constructor(public navCtrl: NavController,
              private authenticationService: DiaAuthService) {}

  tryLogin(){
    this.working = true;
    let data = { email: this.email, password: this.password };

    this.authenticationService.login(data).subscribe(
      (allOk) => {
        this.working = false;
        if(allOk) {
          this.navCtrl.setRoot(TabsPage);
        }
      }
    );
  }
}

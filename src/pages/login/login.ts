import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DiaAuthService } from '../../services/dia-auth-service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController,
              private authenticationService: DiaAuthService) {}

  tryLogin(){
    let data = { email: this.email, password: this.password };
    this.authenticationService.login(data);
  }
}

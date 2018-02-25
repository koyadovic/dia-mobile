import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DiaAuthService } from '../../services/dia-auth-service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";

  @ViewChild('loginContainer') loginContainer;

  constructor(public navCtrl: NavController,
              private authenticationService: DiaAuthService) { }
  
  ionViewDidEnter() {
    setTimeout(() => {
      this.loginContainer.nativeElement.className = 'login-container visible';
    }, 1000);
  }

  tryLogin(){
    let data = { email: this.email, password: this.password };
    this.authenticationService.login(data);
  }
}

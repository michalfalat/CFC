import { Component, OnInit } from '@angular/core';
import { LoginUser, UserInfo, UserLoginInfo } from '../models/user-models';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: LoginUser;
  public errorLogin: boolean = false;
  public loadingData = false;

  constructor(private apiService: ApiService,
     private notification: NotifyService,
      private authService: AuthService,
      private router : Router) {
    this.user = new LoginUser();
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
   }

  ngOnInit() {
  }

  login(){
    console.log(this.user);
    this.errorLogin = false;
    this.loadingData = true;
    this.apiService.loginUser(this.user).subscribe(res => {
      console.log(res)
      this.loadingData = false;
      var loginUser = new UserLoginInfo();
      loginUser.email = res.data.email;
      loginUser.token = res.data.token;
      loginUser.role = res.data.role;
      this.authService.saveUser(loginUser);
      this.router.navigate(['/dashboard']);

    }, err => {
      //this.notification.warning("something went wrong");
      this.errorLogin = true;
      this.loadingData = false;
      console.log(err);
    })
  }

}

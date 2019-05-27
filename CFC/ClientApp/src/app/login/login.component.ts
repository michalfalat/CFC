import { Component, OnInit } from '@angular/core';
import { LoginUser, UserInfo, UserLoginInfo } from '../models/login-user';
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

  constructor(private apiService: ApiService,
     private notification: NotifyService,
      private authService: AuthService,
      private router : Router) {
    this.user = new LoginUser();
   }

  ngOnInit() {
  }

  login(){
    console.log(this.user);
    this.apiService.loginUser(this.user).subscribe(res => {
      console.log(res)
      var loginUser = new UserLoginInfo();
      loginUser.email = res.email;
      loginUser.token = res.token;
      loginUser.role = res.role;
      this.authService.saveUser(loginUser);
      this.router.navigate(['/user']);

    }, err => {
      this.notification.warning("something went wrong");
      console.log(err);
    })
  }

}

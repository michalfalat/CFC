import { Component, OnInit } from '@angular/core';
import { LoginUser, UserInfo, UserLoginInfo } from '../models/user-models';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: LoginUser;
  public errorLogin = false;
  public loadingData = false;

  constructor(private apiService: ApiService,
    private notification: NotifyService,
    private authService: AuthService,
    private router: Router, private notifyService: NotifyService,
    private translateService: TranslateService) {
    this.user = new LoginUser();
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getPath('/dashboard')]);
    }
  }

  ngOnInit() {
  }

  login() {
    console.log(this.user);
    this.errorLogin = false;
    this.loadingData = true;
    this.apiService.loginUser(this.user).subscribe(response => {
      this.loadingData = false;
      const loginUser = new UserLoginInfo();
      loginUser.email = response.data.email;
      loginUser.token = response.data.token;
      loginUser.role = response.data.role;
      this.authService.saveUser(loginUser);
      this.router.navigate(['/dashboard']);

    }, error => {
      this.errorLogin = true;
      this.loadingData = false;
      console.log(error);
      this.notifyService.warning(this.translateService.instant(error.error.errorLabel.value));
    });
  }

}

import { Injectable } from '@angular/core';
import { UserInfo, UserLoginInfo } from '../models/login-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: UserInfo

  constructor() { 
    this.user = null;
  }

  public isLoggedIn() {
    // const userData = localStorage.getItem('auth_user');
    // console.log(userData);
    return this.user !== null ? true : false;
  }

  public getUser() {   
    return this.user;
  }

  public getToken() {
    const userData = JSON.parse(localStorage.getItem('auth_user'));
    return userData !== null ? userData.token : null;
  }

  public getRole() {
    return this.user !== null ? this.user.role : null;
  }

  public saveUser(user: UserLoginInfo) {
    localStorage.setItem('auth_user', JSON.stringify(user));
      this.user = new UserInfo();
      this.user.email = user.email;
      this.user.role = user.role;
  }
  

  public logoutUser() {
    this.user = null;
    localStorage.removeItem('auth_user');
  }

}

import { Injectable } from '@angular/core';
import { UserInfo, UserLoginInfo } from '../models/user-models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<UserInfo>;
  public user: Observable<UserInfo>;
  private role;
  private email;

  constructor() {
    this.userSubject = new BehaviorSubject<UserInfo>(null);
    const userToken = JSON.parse(localStorage.getItem('auth_token'));
    if (userToken !== null) {
      const user = new UserInfo();
      user.email = this.email;
      user.role = this.role;
      this.userSubject.next(user);
    }
    this.user = this.userSubject.asObservable();
  }

  public isLoggedIn() {
    return this.getUser() !== null ? true : false;
  }

  public getUser() {
    return this.userSubject.value;
  }

  public getToken() {
    return JSON.parse(localStorage.getItem('auth_token'));
  }

  public getRole() {
    return this.getUser() !== null ? this.getUser().role : null;
  }

  public isEnabledFor(role) {
    if (this.getRole() === role) {
      return true;
    } else {
      return false;
    }
  }

  public saveUser(userLoginInfo: UserLoginInfo) {
    localStorage.setItem('auth_token', JSON.stringify(userLoginInfo.token));
    const user = new UserInfo();
    user.email = userLoginInfo.email;
    user.role = userLoginInfo.role;
    this.userSubject.next(user);
  }


  public logoutUser() {
    this.userSubject.next(null);
    localStorage.removeItem('auth_token');
  }

  public loadAuthData(apiService: ApiService) {
    return new Promise((resolve, reject) => {
      apiService.loadAuthData(this.getToken()).subscribe(response => {
        if (response.data !== null) {
          this.email = response.data.email;
          this.role = response.data.role[0];

          const user = new UserInfo();
          user.email = this.email;
          user.role = this.role;
          this.userSubject.next(user);
          this.user = this.userSubject.asObservable();
        }
        resolve(true);
      }, error => reject());
    });
  }

  public getPath(path: string) {
    const role = this.getRole();
    if (role === 'Administrator') {
      return `/admin${ path }`;
    }
    return path;
  }

}

import { Injectable } from '@angular/core';
import { UserInfo, UserLoginInfo } from '../models/login-user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  private userSubject: BehaviorSubject<UserInfo>;
  public user: Observable<UserInfo>;

  constructor() { 
    this.userSubject = new BehaviorSubject<UserInfo>(null); 
    const userData = JSON.parse(localStorage.getItem('auth_user'));
    if(userData !== null) {      
      let user = new UserInfo();
      user.email = userData.email;
      user.role = userData.role;
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
    const userData = JSON.parse(localStorage.getItem('auth_user'));
    return userData !== null ? userData.token : null;
  }

  public getRole() {

    return this.getUser() !== null ? this.getUser().role : null;
  }

  public saveUser(userLoginInfo: UserLoginInfo) {
    localStorage.setItem('auth_user', JSON.stringify(userLoginInfo));
    let user = new UserInfo();
    user.email = userLoginInfo.email;
    user.role = userLoginInfo.role;
    this.userSubject.next(user);
  }
  

  public logoutUser() {
    this.userSubject.next(null);
    localStorage.removeItem('auth_user');
  }

}

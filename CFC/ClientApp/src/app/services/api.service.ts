import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginUser, UserPasswordReset, PasswordResetModel, RegisterUser, PasswordChangeModel, EditUser, UserVerifyToken } from '../models/user-models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private registerUserUrl() {
    return this.baseUrl + 'api/Account/Register';
  }

  private loginUserUrl() {
    return this.baseUrl + 'api/Account/Login';
  }

  private userInfoUrl() {
    return this.baseUrl + 'api/Account/UserDetail';
  }
  private userInfoUrl2(id: string) {
    return this.baseUrl + `api/Account/UserDetail/${id}`;
  }

  private requestPasswordResetEmailUrl() {
    return this.baseUrl + 'api/Account/RequestNewPassword';
  }

  private requestPasswordTokenUrl() {
    return this.baseUrl + 'api/Account/RequestPasswordToken';
  }

  private changeResetPasswordUrl() {
    return this.baseUrl + 'api/Account/PasswordReset';
  }

  private changePasswordUrl() {
    return this.baseUrl + 'api/Account/ChangePassword';
  }

  private editUserUrl() {
    return this.baseUrl + 'api/Account/EditUser';
  }

  private getUserListUrl() {
    return this.baseUrl + 'api/Account/GetUsers';
  }

  private blockUserUrl() {
    return this.baseUrl + 'api/Account/BlockUser';
  }

  private removeUserUrl() {
    return this.baseUrl + 'api/Account/RemoveUser';
  }

  private verifyUserUrl() {
    return this.baseUrl + 'api/Account/VerifyUser';
  }

  private getVerifyTokenUrl(token) {
    return this.baseUrl + `api/Account/GetVerifyToken/${token}`;
  }



  private headers;

  constructor(private http: HttpClient,
    private authService: AuthService,
      @Inject('BASE_URL') private baseUrl: string) {
   this.headers = new HttpHeaders();
   this.headers.append('Content-Type', 'application/json');
  // this.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
  }

  registerUser(model: RegisterUser): any {
    return this.http.post(this.registerUserUrl(), model, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));

  }

  loginUser(model: LoginUser): any {
    return this.http.post(this.loginUserUrl(), model, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));
  }

  userDetail(): any {
    return this.http.get(this.userInfoUrl(), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));
  }

  userDetailAdmin(id: string): any {
    return this.http.get(this.userInfoUrl2(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));
  }


  requestEmailForPasswordReset(email: string): any {
    const data = {
      emailAddress: email
    };
    return this.http.post(this.requestPasswordResetEmailUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));
  }

  requestPasswordToken(token: string): any {
    const data = {
      token: token
    };
    return this.http.post(this.requestPasswordTokenUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
        //return this.handleError(error, () => this.registerUser(model));
      }));
  }

  changeResetPassword(data: PasswordResetModel): any {
    return this.http.post(this.changeResetPasswordUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  changePassword(data: PasswordChangeModel): any {
    return this.http.post(this.changePasswordUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  editUser(data: EditUser) {
    return this.http.post(this.editUserUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  getVerifyToken(token): any {
    return this.http.get(this.getVerifyTokenUrl(token),  this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  verifyUser(data: UserVerifyToken) {
    return this.http.post(this.verifyUserUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  blockUser(id: string, block: boolean) {
    const data = {
      id,
      block
    };
    return this.http.post(this.blockUserUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  removeUser(id: string, remove: boolean) {
    const data = {
      id,
      remove
    };
    return this.http.post(this.removeUserUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  getUserList(): any {
    return this.http.get(this.getUserListUrl(), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));

  }

}

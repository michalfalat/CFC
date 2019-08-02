import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginUser, UserPasswordReset, PasswordResetModel, AddUser, PasswordChangeModel, EditUser, UserVerifyToken } from '../models/user-models';
import { AuthService } from './auth.service';
import { CompanyAddModel, CompanyOwnerAddModel } from '../models/company-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private addUserUrl() {
    return this.baseUrl + 'api/Account/AddUser';
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

  private addCompanyUrl() {
    return this.baseUrl + 'api/Company';
  }
  private getCompaniesUrl() {
    return this.baseUrl + 'api/Company';
  }
  private removeCompanyUrl(id) {
    return this.baseUrl + `api/Company/${id}`;
  }
  private unremoveCompanyUrl(id) {
    return this.baseUrl + `api/Company/Unremove/${id}`;
  }
  private getCompanyUrl(id) {
    return this.baseUrl + `api/Company/${id}`;
  }
  private addUserToCompanyUrl(id) {
    return this.baseUrl + `api/Company/${id}/AddUser`;
  }




  private headers;

  constructor(private http: HttpClient,
    private authService: AuthService,
      @Inject('BASE_URL') private baseUrl: string) {
   this.headers = new HttpHeaders();
   this.headers.append('Content-Type', 'application/json');
  // this.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
  }

  addUser(model: AddUser): any {
    return this.http.post(this.addUserUrl(), model, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));

  }

  loginUser(model: LoginUser): any {
    return this.http.post(this.loginUserUrl(), model, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  userDetail(): any {
    return this.http.get(this.userInfoUrl(), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  userDetailAdmin(id: string): any {
    return this.http.get(this.userInfoUrl2(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
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

  addCompany(data: CompanyAddModel) {
    return this.http.post(this.addCompanyUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  removeCompany(id: string, remove: boolean) {
    if (remove) {
    return this.http.delete(this.removeCompanyUrl(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
    } else {
      return this.http.post(this.unremoveCompanyUrl(id), this.headers).pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        }));

    }
  }

  getCompanies(): any {
    return this.http.get(this.getCompaniesUrl(), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  getCompany(id): any {
    return this.http.get(this.getCompanyUrl(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  addUserToCompany(owner: CompanyOwnerAddModel): any {
    return this.http.post(this.addUserToCompanyUrl(owner.companyId), owner,  this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

}

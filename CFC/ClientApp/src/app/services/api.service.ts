import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginUser, UserPasswordReset, PasswordResetModel, AddUser, PasswordChangeModel, EditUser, UserVerifyToken } from '../models/user-models';
import { AuthService } from './auth.service';
import { CompanyAddModel, CompanyOfficeAddModel, OfficeAddModel, CompanyOwnerAddModel, EditCompanyModel } from '../models/company-models';
import { MoneyRecordAddModel } from '../models/money-record-models';
import { EditOfficeModel } from '../models/office-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers;

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

  // COMPANY
  private addCompanyUrl() {
    return this.baseUrl + 'api/Company';
  }
  private getCompaniesUrl() {
    return this.baseUrl + 'api/Company';
  }
  private editCompanyUrl() {
    return this.baseUrl + 'api/Company/Edit';
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
  private getCompanyPreviewUrl(id) {
    return this.baseUrl + `api/Company/${id}/Preview`;
  }
  private addUserToCompanyUrl(id) {
    return this.baseUrl + `api/Company/${id}/AddUser`;
  }
  private removeUserFromCompanyUrl(id, userId) {
    return this.baseUrl + `api/Company/${id}/RemoveUser/${userId}`;
  }


  // OFFICE
  private addOfficeUrl() {
    return this.baseUrl + 'api/Office';
  }
  private getOfficesUrl() {
    return this.baseUrl + 'api/Office';
  }

  private editOfficeUrl() {
    return this.baseUrl + 'api/Office/Edit';
  }
  private removeOfficeUrl(id) {
    return this.baseUrl + `api/Office/${id}`;
  }
  private unremoveOfficeUrl(id) {
    return this.baseUrl + `api/Office/Unremove/${id}`;
  }
  private getOfficeUrl(id) {
    return this.baseUrl + `api/Office/${id}`;
  }
  private addOfficeToCompanyUrl(id) {
    return this.baseUrl + `api/Office/${id}/AddCompany`;
  }

  private removeCompanyFromOfficeUrl(id, companyId) {
    return this.baseUrl + `api/Office/${id}/RemoveCompany/${companyId}`;
  }


  // MONEY RECORDS
  private getMoneyRecordsUrl(type: string) {
    return this.baseUrl + `api/MoneyRecord/all/${type}`;
  }

  private addMoneyRecordUrl() {
    return this.baseUrl + 'api/MoneyRecord';
  }



  constructor(private http: HttpClient,
    private authService: AuthService,
      @Inject('BASE_URL') private baseUrl: string) {
   this.headers = new HttpHeaders();
   this.headers.append('Content-Type', 'application/json');
  // this.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
  }

  checkInternalError(error) {
    if (error.status === 500) {
      const ERROR_INT = {
        errorLabel : {
          value: 'INTERNAL_SERVER_ERROR'
        }
      };
      error.error = ERROR_INT;
      console.log(`INTERNAL ERROR: ${error}`);
    } else {
      return error;
    }
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

  getCompanyPreview(id): any {
    return this.http.get(this.getCompanyPreviewUrl(id), this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }

  editCompany(data: EditCompanyModel) {
    console.log(data);
    return this.http.post(this.editCompanyUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  addUserToCompany(owner: CompanyOwnerAddModel): any {
    return this.http.post(this.addUserToCompanyUrl(owner.companyId), owner,  this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }
  removeUserFromCompany(companyId, userId): any {
    return this.http.delete(this.removeUserFromCompanyUrl(companyId, userId), this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }


  addOffice(data: OfficeAddModel) {
    return this.http.post(this.addOfficeUrl(), data, this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }

  editOffice(data: EditOfficeModel) {
    return this.http.post(this.editOfficeUrl(), data, this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  addCompanyToOffice(company: CompanyOfficeAddModel): any {
    return this.http.post(this.addOfficeToCompanyUrl(company.officeId), company,  this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }

  removeOfficeFromCompany(officeId: number, companyId: boolean) {
    return this.http.delete(this.removeCompanyFromOfficeUrl(officeId, companyId), this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }


  getOffices(): any {
    return this.http.get(this.getOfficesUrl(), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  getOffice(id: number): any {
    return this.http.get(this.getOfficeUrl(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  removeOffice(id: string, remove: boolean) {
    if (remove) {
    return this.http.delete(this.removeOfficeUrl(id), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
    } else {
      return this.http.post(this.unremoveOfficeUrl(id), this.headers).pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        }));

    }
  }


  getMoneyRecordsForCompany(): any {
    return this.http.get(this.getMoneyRecordsUrl('company'), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  getMoneyRecordsPersonal(): any {
    return this.http.get(this.getMoneyRecordsUrl('personal'), this.headers).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      }));
  }

  addMoneyRecord(moneyRecord: MoneyRecordAddModel): any {
    return this.http.post(this.addMoneyRecordUrl(), moneyRecord,  this.headers).pipe(
      catchError(error => {
        error = this.checkInternalError(error);
        return throwError(error);
      }));
  }

}

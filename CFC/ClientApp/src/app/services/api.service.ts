import { Injectable, Inject } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LoginUser } from '../models/login-user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private registerUserUrl(){
    return this.baseUrl + 'api/Account/Register'
  }

  private loginUserUrl(){
    return this.baseUrl + 'api/Account/Login'
  }

  private userInfoUrl(){
    return this.baseUrl + 'api/Account/UserDetail'
  }


  private headers;

  constructor(private http: HttpClient,
    private authService : AuthService,
      @Inject('BASE_URL') private baseUrl: string) { 
   this.headers = new HttpHeaders()
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
}

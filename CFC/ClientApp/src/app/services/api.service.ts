import { Injectable, Inject } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LoginUser } from '../models/login-user';

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

  private headers;

  constructor(private http: HttpClient,  @Inject('BASE_URL') private baseUrl: string) { 
   this.headers = new HttpHeaders()
   this.headers.append('Content-Type', 'application/json');
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
}

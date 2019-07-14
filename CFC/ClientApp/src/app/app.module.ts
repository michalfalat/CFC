import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { DefaultUserComponent } from './default-user/default-user.component';
import { RegisterComponent } from './register/register.component';
import { UserVerifyComponent } from './user-verify/user-verify.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthInterceptor } from './auth-interceptor/auth-interceptor.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { CookieService } from 'ngx-cookie-service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    DefaultUserComponent,
    RegisterComponent,
    UserVerifyComponent,
    UserDetailComponent,
    PasswordResetComponent,
    ForgottenPasswordComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },      
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'default-user-generator', component: DefaultUserComponent },
      { path: 'register-user', component: RegisterComponent },
      { path: 'user', component: UserDetailComponent },
      { path: 'reset-password/:token', component: PasswordResetComponent },
      { path: 'forgotten-password', component: ForgottenPasswordComponent },
    ]),
    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    CustomMaterialModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AuthGuard } from 'src/guards/auth-guard.service';
import { AdminAuthGuard } from 'src/guards/admin-auth-guard.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';

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
    AdminDashboardComponent,
    UserListComponent,
    CompanyListComponent,
    DashboardComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'default-user-generator', component: DefaultUserComponent },
      { path: 'user', component: UserDetailComponent },
      { path: 'reset-password/:token', component: PasswordResetComponent },
      { path: 'forgotten-password', component: ForgottenPasswordComponent },
      { path: 'about', component: AboutComponent },
      {
        path: 'admin',
        canActivateChild: [AdminAuthGuard],         // <-- This guard will run before the router directs you to the route
        children: [
          {
            path: '',
            redirectTo: '/admin/dashboard',   // <-- Redirects to dashboard route below
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: AdminDashboardComponent,
            pathMatch: 'full'
          },
          {
            path: 'users',
            component: UserListComponent,
            // pathMatch: 'full',
            children: [
              {
                path: 'new',
                component: RegisterComponent,

                // pathMatch: 'full',
              },
            ]
          },
          {
            path: 'companies',
            component: CompanyListComponent,
            pathMatch: 'full'
          },
          // <-- The rest of your admin routes
        ]
      }
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
    CookieService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

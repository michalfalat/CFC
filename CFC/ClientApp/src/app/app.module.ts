import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { DefaultUserComponent } from './default-user/default-user.component';
import { AddUserComponent } from './register/register.component';
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
import { UserEditComponent } from './user-edit/user-edit.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OfficeAddComponent } from './office-add/office-add.component';
import { OfficeDetailComponent } from './office-detail/office-detail.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { CompanyFinancialsComponent } from './company-financials/company-financials.component';
import { PersonalFinancialsComponent } from './personal-financials/personal-financials.component';
import { CompanyFinancialsAddComponent } from './company-financials-add/company-financials-add.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    LoginComponent,
    DefaultUserComponent,
    AddUserComponent,
    UserVerifyComponent,
    UserDetailComponent,
    PasswordResetComponent,
    ForgottenPasswordComponent,
    AdminDashboardComponent,
    UserListComponent,
    CompanyListComponent,
    DashboardComponent,
    AboutComponent,
    UserEditComponent,
    CompanyAddComponent,
    CompanyDetailComponent,
    OfficeAddComponent,
    OfficeDetailComponent,
    OfficeListComponent,
    CompanyFinancialsComponent,
    PersonalFinancialsComponent,
    CompanyFinancialsAddComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, data: { title: 'Login' } },
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'default-user-generator', component: DefaultUserComponent },
      { path: 'user', component: UserDetailComponent },
      { path: 'reset-password/:token', component: PasswordResetComponent },
      { path: 'forgotten-password', component: ForgottenPasswordComponent },
      { path: 'about', component: AboutComponent },
      { path: 'verify/:token', component: UserVerifyComponent },
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
            pathMatch: 'full',

          },
          {
            path: 'users/add',
            component: AddUserComponent,
            pathMatch: 'full'
          },
          {
            path: 'users/edit/:id',
            component: UserEditComponent,
            pathMatch: 'full'
          },
          {
            path: 'companies',
            component: CompanyListComponent,
            pathMatch: 'full'
          },
          {
            path: 'companies/add',
            component: CompanyAddComponent,
            pathMatch: 'full'
          },
          {
            path: 'companies/:id',
            component: CompanyDetailComponent,
            pathMatch: 'full'
          },
          {
            path: 'offices',
            component: OfficeListComponent,
            pathMatch: 'full'
          },
          {
            path: 'offices/add',
            component: OfficeAddComponent,
            pathMatch: 'full'
          },
          {
            path: 'offices/:id',
            component: OfficeDetailComponent,
            pathMatch: 'full'
          },
          {
            path: 'companyRecords',
            component: CompanyFinancialsComponent,
            pathMatch: 'full'
          },
          {
            path: 'companyRecords/add',
            component: CompanyFinancialsAddComponent,
            pathMatch: 'full'
          },
          {
            path: 'personalRecords',
            component: PersonalFinancialsComponent,
            pathMatch: 'full'
          },
          {
            path: 'personalRecords/add',
            component: PersonalFinancialsComponent,
            pathMatch: 'full'
          },

          // {
          //   path: 'officcompanyRecordses/:id',
          //   component: CompanyFinancialDetailComponent,
          //   pathMatch: 'full'
          // },

          // <-- The rest of your admin routes
        ]
      },
      {
        path: 'companies',
        component: CompanyListComponent,
        pathMatch: 'full'
      },
      {
        path: 'companies/:id',
        component: CompanyDetailComponent,
        pathMatch: 'full'
      },
      {
        path: 'offices',
        component: OfficeListComponent,
        pathMatch: 'full'
      },
      {
        path: 'offices/:id',
        component: OfficeDetailComponent,
        pathMatch: 'full'
      },
      {
        path: 'companyRecords',
        component: CompanyFinancialsComponent,
        pathMatch: 'full'
      },
      {
        path: 'companyRecords/add',
        component: CompanyFinancialsAddComponent,
        pathMatch: 'full'
      },
      {
        path: 'personalRecords',
        component: PersonalFinancialsComponent,
        pathMatch: 'full'
      },
      {
        path: 'personalRecords/add',
        component: PersonalFinancialsComponent,
        pathMatch: 'full'
      },
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
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent],
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   *
   */
  constructor(private authService: AuthService, private router: Router,
    private notifyService: NotifyService, private translateService: TranslateService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // you probably want to store it in localStorage or something

    if (token === null) {
      return next.handle(req).pipe(catchError((error, caught) => {
        if (error.status === 401) {
          this.notifyService.error(this.translateService.instant('NOT_AUTHORIZED'));
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          this.notifyService.error(this.translateService.instant('INTERNAL_SERVER_ERROR'));
        }
        return of(error);
      }) as any);
    }

    const req1 = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    // return next.handle(req1);
    return next.handle(req1).pipe(catchError((error, caught) => {
      if (error.status === 401 || error.status === 403) {
        this.notifyService.error(this.translateService.instant('NOT_AUTHORIZED'));
        this.router.navigate(['/login']);
      } else if (error.status === 500) {
        this.notifyService.error(this.translateService.instant('INTERNAL_SERVER_ERROR'));
      }
      return throwError(error);
    }) as any);
  }

}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from '../snackbar-container';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) { }

  info(message: string, action: string = 'OK', duration = 5000) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['notification-info'],
      data: {
        message: message,
        icon: 'info'
      }
    });
  }

  warning(message: string, action: string = 'OK', duration = 10000) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['notification-warning'],
      data: {
        message: message,
        icon: 'info'
      }
    });
    // this.snackBar.open(message, action, {
    //   duration: duration,
    //   verticalPosition: "top",
    //   panelClass: ['notification-warning']
    // });
  }

  error(message: string, action: string = 'OK', duration = 10000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['notification-error']
    });
  }

  processError(error: any, duration = 10000) {
    console.log(error);
    let errorLabel = '';
    switch (error.status) {
      case 401:
        errorLabel = 'NOT_AUTHORIZED';
        break;
      case 403:
        errorLabel = 'NOT_AUTHORIZED';
        break;
      case 500:
        errorLabel = 'INTERNAL_SERVER_ERROR';
        break;
      default:
        errorLabel = this.getSafe(() => error.error.errorLabel.value);
        break;
    }
    const translatedError = this.translateService.instant(errorLabel);
    this.snackBar.open(translatedError, 'OK', {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['notification-error']
    });
  }

  private getSafe(fn) {
    try {
      return fn();
    } catch (e) {
      return 'ERROR';
    }
  }
}

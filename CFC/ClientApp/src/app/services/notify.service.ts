import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private snackBar: MatSnackBar) { }

  info(message: string, action: string = "OK", duration = 5000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: "top",
      panelClass: ['notification-info']
    });
  }

  warning(message: string, action: string = "OK", duration = 10000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: "top",
      panelClass: ['notification-warning']
    });
  }
}

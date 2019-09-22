import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {
  public email: string;
  public loadingData = false;
  public emailSent = false;

  constructor(private apiService: ApiService, private notifyService: NotifyService, private translateService: TranslateService) { }

  ngOnInit() {
  }

  sendLink() {
    this.loadingData = true;
    this.apiService.requestEmailForPasswordReset(this.email).subscribe((response) => {
      // this.notifyService.info(this.translateService.instant('email-sent'));
      this.loadingData = false;
      this.emailSent = true;
    }, error => {
      this.notifyService.warning(this.translateService.instant(error.error.errorLabel.value));
      this.loadingData = false;
    });

  }

}

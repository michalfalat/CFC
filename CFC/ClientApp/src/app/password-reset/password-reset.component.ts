import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPasswordReset, PasswordResetModel } from '../models/user-models';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public errorPasswordMatch = false;
  public loadingData = true;
  public formData: UserPasswordReset;
  private tokenLink: string;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService,
    private notifyService: NotifyService, private translateService: TranslateService) {
    this.formData = new UserPasswordReset();
  }

  ngOnInit() {
    this.tokenLink  = this.route.snapshot.params.token;
    this.apiService.requestPasswordToken(this.tokenLink).subscribe((response) => {
      this.formData.token = response.data.token;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.router.navigate(['/']);
      this.notifyService.processError(error);
    });

  }

  reset() {
    this.errorPasswordMatch = false;
    if (this.formData.password1 !== this.formData.password2) {
      this.errorPasswordMatch = true;
      return;
    }
    const model = new PasswordResetModel();
    model.link = this.tokenLink;
    model.token = this.formData.token;
    model.password = this.formData.password1;
    this.loadingData = true;
    this.apiService.changeResetPassword(model).subscribe((response) => {
      this.notifyService.info(this.translateService.instant('password-changed'));
      this.router.navigate(['/login']);
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });

  }

}

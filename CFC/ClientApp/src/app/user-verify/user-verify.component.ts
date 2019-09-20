import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserVerifyToken } from '../models/user-models';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-verify',
  templateUrl: './user-verify.component.html',
  styleUrls: ['./user-verify.component.css']
})
export class UserVerifyComponent implements OnInit {
  public loadingData = true;
  public formData: UserVerifyToken;
  public errorPasswordMatch = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private notifyService: NotifyService,
    private translateService: TranslateService, private router: Router) {
    this.formData = new UserVerifyToken();
   }

  ngOnInit() {
    this.formData.token  = this.route.snapshot.params.token;
    this.apiService.getVerifyToken(this.formData.token).subscribe((response) => {
      this.formData.email = response.data.email;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
      this.router.navigate(['/login']);
    });
  }


  verify() {
    this.errorPasswordMatch = false;
    if (this.formData.password !== this.formData.password2) {
      this.errorPasswordMatch = true;
      return;
    }
    this.loadingData = true;
    this.apiService.verifyUser(this.formData).subscribe((response) => {
    this.notifyService.info(this.translateService.instant('email-activated'));
    this.loadingData = false;
    this.router.navigate(['/login']);

  }, error => {
    this.loadingData = false;
    this.notifyService.processError(error);
  });

  }

}

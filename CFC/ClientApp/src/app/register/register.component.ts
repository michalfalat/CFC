import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RegisterUser } from '../models/user-models';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: RegisterUser;
  public existingUserError: Boolean = false;
  public loadingData = false;

  constructor(private apiService: ApiService, private notifyService: NotifyService, private translateService: TranslateService,
    private router: Router) {
    this.user = new RegisterUser();
   }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate(['/admin/users']);
  }

  registerUser() {
    this.loadingData = true;
    this.existingUserError = false;
    this.apiService.registerUser(this.user).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

}

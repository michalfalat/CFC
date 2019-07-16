import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserDetail, PasswordChangeModel } from '../models/user-models';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public userDetail: UserDetail;
  public passwordChangeForm: PasswordChangeModel;
  public editMode = false;
  public loadingData = true;
  public errorPasswordMatch = false;

  constructor(private apiService: ApiService, private notifyService: NotifyService, private translateService: TranslateService) { 
    this.userDetail = new UserDetail();
    this.passwordChangeForm = new PasswordChangeModel();
  }

  ngOnInit() {
    this.apiService.userDetail().subscribe(response => {
      this.userDetail = response;
      this.loadingData = false;

    }, error => {
      console.log("error");
      this.loadingData = false;
    })
  }

  changePassword(form: NgForm) {
    if(this.passwordChangeForm.newPassword !== this.passwordChangeForm.newPassword2) {
      this.errorPasswordMatch = true;
      return;
    }
    this.loadingData = true;
    this.apiService.changePassword(this.passwordChangeForm).subscribe((response) => {
      this.notifyService.info(this.translateService.instant("password-changed"));
      this.loadingData = false;
      this.passwordChangeForm = new PasswordChangeModel();
      form.resetForm();

    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
      this.loadingData = false;
      this.passwordChangeForm = new PasswordChangeModel();
      form.resetForm();
    })
    
  }

  enableEditMode() {
    this.editMode = true;
  }

}

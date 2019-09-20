import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserDetail, PasswordChangeModel, EditUser } from '../models/user-models';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

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
    this.getUser();
  }

  changePassword(form: NgForm) {
    this.errorPasswordMatch = false;
    if (this.passwordChangeForm.newPassword !== this.passwordChangeForm.newPassword2) {
      this.errorPasswordMatch = true;
      return;
    }
    this.loadingData = true;
    this.apiService.changePassword(this.passwordChangeForm).subscribe((response) => {
      this.notifyService.info(this.translateService.instant('password-changed'));
      this.loadingData = false;
      this.passwordChangeForm = new PasswordChangeModel();
      form.resetForm();

    }, error => {
      this.loadingData = false;
      this.passwordChangeForm = new PasswordChangeModel();
      form.resetForm();
      this.notifyService.processError(error);
    });

  }

  getUser() {
    this.apiService.userDetail().subscribe(response => {
      this.userDetail = response.data.user;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  editUser() {
    const user: EditUser = {
      email: this.userDetail.email,
      name: this.userDetail.name,
      surname: this.userDetail.surname,
      phone: this.userDetail.phone,
    };
    this.loadingData = true;
    this.apiService.editUser(user).subscribe((response) => {
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.loadingData = false;
      this.editMode = false;
      this.getUser();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });


  }

  toogleEditMode() {
    this.editMode =  !this.editMode;
  }

}

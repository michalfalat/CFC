import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserDetail, PasswordChangeModel, EditUser } from '../models/user-models';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  public userDetail: UserDetail;
  public editMode = false;
  public loadingData = true;
  constructor(private route: ActivatedRoute, private apiService: ApiService,
    private notifyService: NotifyService, private translateService: TranslateService, private router: Router) {
    this.userDetail = new UserDetail();
  }

  ngOnInit() {
    this.userDetail.id = this.route.snapshot.params.id;
    this.getUser();
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }

  getUser() {
    this.apiService.userDetailAdmin(this.userDetail.id).subscribe(response => {
      this.userDetail = response.data.user;
      this.userDetail.id = this.route.snapshot.params.id;
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
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode === false) {
      this.getUser();
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPasswordReset, PasswordResetModel } from '../models/login-user';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public errorPasswordMatch = false;
  public formData: UserPasswordReset;
  private tokenLink: string;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private notifyService: NotifyService) { 
    this.formData = new UserPasswordReset();
  }

  ngOnInit() {
    this.tokenLink  = this.route.snapshot.params.token;
    console.log(this.tokenLink);
    this.apiService.requestPasswordToken(this.tokenLink).subscribe((response) => {
      console.log(response);
      this.formData.token = response.token;

    }, error => {
      this.notifyService.error("Invalid token");
      this.router.navigate(['/login']);
      console.log(error);
    })

  }

  reset() {
    this.errorPasswordMatch = false;
    if(this.formData.password1 !== this.formData.password2) {
      this.errorPasswordMatch = true;
      return;
    }
    const model = new PasswordResetModel();
    model.link = this.tokenLink;
    model.token = this.formData.token;
    model.password = this.formData.password1;
    this.apiService.changePassword(model).subscribe((response) => {
      console.log(response);
      this.notifyService.info("password was changed");
      this.router.navigate(['/login']);

    }, error => {
      this.notifyService.error("Invalid token");
      console.log(error);
    })

    // TODO
    // if()
  }

}

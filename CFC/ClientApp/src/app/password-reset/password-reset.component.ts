import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPasswordReset } from '../models/login-user';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public formData: UserPasswordReset

  constructor(private route: ActivatedRoute) { 
    this.formData = new UserPasswordReset();
  }

  ngOnInit() {
    this.formData.token = this.route.snapshot.params.token;
    console.log(this.formData.token);
  }

  reset() {
    // TODO
    // if()
  }

}

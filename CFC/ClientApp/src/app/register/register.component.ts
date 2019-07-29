import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RegisterUser } from '../models/user-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: RegisterUser;
  public existingUserError: Boolean = false;
  public loadingData = false;

  constructor(private apiService: ApiService,
    private router : Router) {
    this.user = new RegisterUser();
   }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate(['/admin/users']);
  }

  registerUser(){
    this.loadingData = true;
    this.existingUserError = false;
    this.apiService.registerUser(this.user).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.goBack();

    }, error => {
      this.loadingData = false;
      switch (error.error.message) {
        case "existingUser":
          this.existingUserError = true;
          break;

        default:
          break;
      }
      console.log(error);
    })
  }

}

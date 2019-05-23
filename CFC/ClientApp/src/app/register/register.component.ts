import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: RegisterUser;
  public existingUserError: Boolean = false;
  public loadingAction = false;

  constructor(private apiService: ApiService) {
    this.user = new RegisterUser();
   }

  ngOnInit() {
  }

  registerUser(){
    this.loadingAction = true;
    this.existingUserError = false;
    this.apiService.registerUser(this.user).subscribe(response => {
      console.log(response);
      this.loadingAction = false;

    }, error => {
      this.loadingAction = false;
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

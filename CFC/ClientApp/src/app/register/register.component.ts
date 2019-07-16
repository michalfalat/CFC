import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RegisterUser } from '../models/user-models';

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

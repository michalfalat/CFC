import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {
  public email: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  sendLink() {
    this.apiService.requestEmailForPasswordReset(this.email).subscribe( (response) => {
      console.log(response);
    }, error => {

      console.log(error);
    })

  }

}

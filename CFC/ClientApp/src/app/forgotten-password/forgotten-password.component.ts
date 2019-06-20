import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {
  public email: string;

  constructor(private apiService: ApiService, private notifyService: NotifyService) { }

  ngOnInit() {
  }

  sendLink() {
    this.apiService.requestEmailForPasswordReset(this.email).subscribe( (response) => {
      console.log(response);
      this.notifyService.info("Email was sent");
    }, error => {
      
      this.notifyService.warning("An error");
      console.log(error);
    })

  }

}

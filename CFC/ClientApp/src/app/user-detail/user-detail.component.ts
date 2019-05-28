import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserDetail } from '../models/detail-user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public userDetail: UserDetail;

  constructor(private apiService: ApiService) { 
    this.userDetail = new UserDetail();
  }

  ngOnInit() {
    this.apiService.userDetail().subscribe(response => {
      console.log(response);
      this.userDetail = response;

    }, error => {
      console.log("error");
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public loadingData = true;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.apiService.getUserList().subscribe(response => {
      console.log(response);
      this.loadingData = false;

    }, error => {
      console.log("error");
      this.loadingData = false;
    })
  }

}

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public loadingData = true;
  public userList;
  public displayedColumns: string[] = ['name', 'surname', 'email', 'emailConfirmed', 'phoneNumber', 'actions'];  
  @ViewChild(MatSort, {read: true}) sort: MatSort;

  constructor(private apiService: ApiService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUsers();
  }

  refresh() {
    this.getUsers();
  }

  getUsers() {
    this.userList = [];
    this.loadingData = true;
    this.apiService.getUserList().subscribe(response => {
      console.log(response);
      this.userList = new MatTableDataSource(response.data);
      this.userList.sort = this.sort;
      console.log(this.userList);
      this.ref.detectChanges();
      this.loadingData = false;

    }, error => {
      console.log("error");
      this.loadingData = false;
    })
  }

}

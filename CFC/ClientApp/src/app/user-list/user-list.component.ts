import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public loadingData = true;
  public userList;
  public displayedColumns: string[] = ['name', 'surname', 'email', 'role', 'emailConfirmed', 'phoneNumber', 'actions'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private apiService: ApiService,  private notifyService: NotifyService, private translateService: TranslateService) { }

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
      this.userList = new MatTableDataSource(response.data);
      this.userList.sort = this.sort;
      this.loadingData = false;

    }, error => {
      console.log('error');
      this.loadingData = false;
    });
  }

  blockUser(element) {
    const id = element.id;
    const block  = element.blocked ? false : true;
    this.loadingData = true;
    this.apiService.blockUser(id, block).subscribe(response => {
      if (block) {
        this.notifyService.info(this.translateService.instant('user-blocked'));
      } else {
        this.notifyService.info(this.translateService.instant('user-unblocked'));
      }
     this.getUsers();
    }, error => {
      this.notifyService.error(this.translateService.instant('user-blocked'));
      this.loadingData = false;
    });
  }

}

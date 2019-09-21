import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

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

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService,  private notifyService: NotifyService, private translateService: TranslateService, private router: Router) { }

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
      this.userList.paginator = this.paginator;
      this.loadingData = false;

    }, error => {
      console.log('error');
      this.loadingData = false;
    });
  }

  goToDetail(id) {
    this.router.navigate(['/admin/users/edit/' + id ]);
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
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant('user-blocked'));
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { CompanyOwnerAddModel } from '../models/company-models';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  public companyId;
  public company;
  public companyOwners;
  public loadingData = false;
  public addUserFormVisible = false;

  public newOwner: CompanyOwnerAddModel;
  public allUsers: UserDetail[] = [];

  public displayedColumnsOwners: string[] = ['userName', 'userSurname', 'percentage',  'actions'];
  @ViewChild(MatSort, {read: false}) sort: MatSort;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.companyId = this.route.snapshot.params.id;
    if (this.companyId == null) {
      this.goBack();
    }
    this.newOwner = new CompanyOwnerAddModel();
    this.loadCompany();
    this.loadUsers();
  }

  goBack() {
    this.router.navigate(['/admin/companies']);
  }

  loadCompany() {
    this.apiService.getCompany(this.companyId).subscribe(response => {
      console.log(response);
      this.company = response.data.company;
      this.companyOwners = new MatTableDataSource(response.data.company.owners);
      this.companyOwners.sort = this.sort;
      console.log(this.companyOwners);
      this.loadingData = false;

    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
      console.log(error);
      this.loadingData = false;
    });
  }
  loadUsers() {
    this.apiService.getUserList().subscribe(response => {
      console.log(response);
      this.allUsers = response.data;
      this.loadingData = false;

    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
      console.log(error);
      this.loadingData = false;
    });
  }

  addUser() {
    this.addUserFormVisible = true;
  }

  saveCompanyUser() {
    this.loadingData = true;
    this.newOwner.companyId = this.companyId;
    this.apiService.addUserToCompany(this.newOwner).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.loadCompany();
      this.addUserFormVisible = false;
    }, error => {
      console.log(error);
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });

  }



}

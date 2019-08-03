import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { CompanyOwnerAddModel } from '../models/company-models';
import { MatSort, MatTableDataSource } from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit {
  public companyId;
  public company;
  public companyOwners;
  public loadingData = false;
  public addUserFormVisible = false;

  public newOwner: CompanyOwnerAddModel;
  public allUsers: UserDetail[] = [];

  public maxNewOwnerPercentage = 100;

  public displayedColumnsOwners: string[] = ['userName', 'userSurname', 'percentage',  'actions'];
  @ViewChild(MatSort, {read: false}) sort: MatSort;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.companyId = this.route.snapshot.params.id;
    if (this.companyId == null) {
      this.goBack();
    }
    this.newOwner = new CompanyOwnerAddModel();
    this.newOwner.percentage = this.maxNewOwnerPercentage;
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
      this.calculateMaxPercentageForOwner();
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }
  loadUsers() {
    this.apiService.getUserList().subscribe(response => {
      console.log(response);
      this.allUsers = response.data;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

  addUser() {
    this.addUserFormVisible = true;
  }

  removeCompanyUser(userId) {
    this.loadingData = true;
    this.apiService.removeUserFromCompany(this.companyId, userId).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.loadCompany();
    }, error => {
      console.log(error);
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

  calculateMaxPercentageForOwner() {
    let totalPercentageSum = 0;
    this.company.owners.forEach(owner => {
      totalPercentageSum += owner.percentage;
    });
  this.maxNewOwnerPercentage = 100 - totalPercentageSum;
  this.newOwner.percentage = this.maxNewOwnerPercentage;
  }

  saveCompanyUser() {
    this.loadingData = true;
    this.newOwner.companyId = this.companyId;
    this.apiService.addUserToCompany(this.newOwner).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.newOwner = new CompanyOwnerAddModel();
      this.loadCompany();
      this.addUserFormVisible = false;
    }, error => {
      console.log(error);
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });

  }

  openRemoveUserDialog(userId): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.translateService.instant('confirm-remove-owner')
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result === true) {
        this.removeCompanyUser(userId);
      }
    });
  }



}

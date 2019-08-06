import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { CompanyOwnerAddModel } from '../models/company-models';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit {
  public selectedTab = 0;
  public companyId;
  public company;
  public companyOwners;
  public companyOffices;
  public loadingData = false;
  public addUserFormVisible = false;
  public editMode = false;

  public newOwner: CompanyOwnerAddModel;
  public allUsers: UserDetail[] = [];

  public maxNewOwnerPercentage = 100;

  public displayedColumnsOwners: string[] = ['userName', 'userSurname', 'percentage', 'actions'];
  public displayedColumnsOffices: string[] = ['name', 'description', 'registrationDate', 'ownersCount', 'actions'];
  @ViewChild(MatSort, { read: false }) sortOwners: MatSort;
  @ViewChild(MatSort, { read: false }) sortOffices: MatSort;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.sortOwners = new MatSort();
    this.sortOffices = new MatSort();
    this.companyId = this.route.snapshot.params.id;
    const tab = this.route.snapshot.params.tab;
    const tabOptions = {
      info: 0,
      offices: 1,
      owners: 2,
    };
    if (tab !== null) {
      this.selectedTab = tabOptions[tab];
    }
    console.log(tab);
    if (this.companyId == null) {
      this.goBack();
    }
    this.newOwner = new CompanyOwnerAddModel();
    this.newOwner.percentage = this.maxNewOwnerPercentage;
    this.loadCompany();
  }

  goBack() {
    this.router.navigate(['/admin/companies']);
  }

  loadCompany() {
    this.apiService.getCompany(this.companyId).subscribe(response => {
      console.log(response);
      this.company = response.data.company;
      this.companyOwners = new MatTableDataSource(response.data.company.owners);
      this.companyOwners.sort = this.sortOwners;


      this.companyOffices = new MatTableDataSource(response.data.company.offices);
      this.companyOffices.sort = this.sortOffices;
      this.loadUsers();
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
      this.allUsers = response.data.filter(u => u.role === 'Owner' && this.company.owners.map(c => c.userId).includes(u.id) === false);
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

  addOffice() {
    this.router.navigate([`/admin/companies/${ this.companyId }/addOffice`]);
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
  removeCompanyOffice(element) {
    this.loadingData = true;
    const remove = element.obsolete === true ? false : true;
    this.apiService.removeOfficeFromCompany(element.id, remove).subscribe(response => {
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
      if (result === true) {
        this.removeCompanyUser(userId);
      }
    });
  }
  openRemoveOfficeDialog(office): void {
    if (office.obsolete) {
      this.removeCompanyOffice(office);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.translateService.instant('confirm-remove-office')
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.removeCompanyOffice(office);
        }
      });
    }
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
  }



}

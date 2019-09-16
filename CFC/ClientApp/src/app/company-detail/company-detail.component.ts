import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CompanyOwnerAddModel } from '../models/company-models';
import { CompanyUserRole, CompanyStatus } from '../models/enums';
import { AuthService } from '../services/auth.service';

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
  public cashflow;

  public cashflowView = 'table';
  public newOwner;
  public allUsers: UserDetail[] = [];

  public companyUserRole = CompanyUserRole;

  public companyStatuses = Object.keys(CompanyStatus).filter(s => Number.isNaN(Number(s)));
  public companyStatus = CompanyStatus;

  public maxNewOwnerPercentage = 100;

  public displayedColumnsOwners: string[] = ['userName', 'userSurname', 'role', 'percentage', 'actions'];
  public displayedColumnsOffices: string[] = ['name', 'percentage', 'actions'];
  public displayedColumnsCashFlow: string[] = ['createdAt', 'creator', 'officeName', 'description', 'amount'];
  @ViewChild(MatSort, { static: false }) sortOwners: MatSort;
  @ViewChild(MatSort, { static: false }) sortOffices: MatSort;
  @ViewChild(MatSort, { static: false }) sortCashflow: MatSort;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public authService: AuthService) {
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
    this.router.navigate([this.authService.getPath('/companies')]);
  }

  loadCompany() {
    this.apiService.getCompany(this.companyId).subscribe(response => {
      console.log(response);
      this.company = response.data.company;
      this.companyOwners = new MatTableDataSource(response.data.company.owners);
      this.companyOwners.sort = this.sortOwners;


      this.companyOffices = new MatTableDataSource(response.data.company.offices);
      this.companyOffices.sort = this.sortOffices;

      this.cashflow = new MatTableDataSource(response.data.company.cashflow);
      this.cashflow.sort = this.sortCashflow;
      // if(this.au)
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

  editCompany() {
    this.company.companyId = this.companyId;
    this.apiService.editCompany(this.company).subscribe(response => {
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.loadingData = false;
      this.editMode = false;
      this.loadCompany();
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
  removeCompanyOffice(office) {
    this.loadingData = true;
    this.apiService.removeOfficeFromCompany(office.officeId, this.companyId).subscribe(response => {
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
    console.log(office);
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

  calcAmount(element) {
    if (element.officeId === null) {
      return element.amount;
    } else {
      const companyOffice = this.company.offices.find(a => a.officeId === element.officeId);
      if (companyOffice !== undefined) {
        const percentage = companyOffice.percentage;
        return element.amount / 100 * percentage;

      }
    }
  }


  calcAmountSecondaryData(element) {
    if (element.officeId === null) {
      return '';
    } else {
      const companyOffice = this.company.offices.find(a => a.officeId === element.officeId);
      if (companyOffice !== undefined) {
        const percentage = companyOffice.percentage;
        return `(${ element.type === 2 ? '' : '-' }${ element.amount }€ * ${ percentage }%)`;

      }
    }
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
  }
}

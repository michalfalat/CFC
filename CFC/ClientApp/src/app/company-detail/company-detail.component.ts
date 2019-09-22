import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PercentageDialogComponent } from '../percentage-dialog/percentage-dialog.component';
import { CompanyOwnerAddModel } from '../models/company-models';
import { CompanyUserRole, CompanyStatus } from '../models/enums';
import { AuthService } from '../services/auth.service';
import { PercentageEntryData, PercentageSaveData } from '../models/percentage-models';
import { MoneyRecordType } from '../models/enums';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit, AfterContentInit {
  public selectedTab = 0;
  public companyId;
  public company;
  public companyOwners;
  public companyOffices;
  public loadingData = false;
  public editMode = false;
  public cashflow;
  public percentageNotFilledWarning = false;

  public cashflowView;
  public newOwner;
  public allOwners: UserDetail[] = [];

  public companyUserRole = CompanyUserRole;

  public companyStatuses = Object.keys(CompanyStatus).filter(s => Number.isNaN(Number(s)));
  public companyStatus = CompanyStatus;

  public maxNewOwnerPercentage = 100;

  public moneyRecordTypes = Object.keys(MoneyRecordType).filter(s => Number.isNaN(Number(s)));

  public moneyRecordType = MoneyRecordType;

  public filteredCashflow;

  public recreatedChart = true;

  public displayedColumnsOwners: string[] = ['userName', 'userSurname', 'role', 'percentage', 'actions'];
  public displayedColumnsOffices: string[] = ['name', 'percentage', 'actions'];
  public displayedColumnsCashFlow: string[] = ['createdAt', 'creator', 'officeName', 'description', 'amount'];
  @ViewChild(MatSort, { static: false }) sortOwners: MatSort;
  @ViewChild(MatSort, { static: false }) sortOffices: MatSort;
  // @ViewChild(MatSort, { static: false }) sortCashflow: MatSort;
  @ViewChild('sortColMoney', { static: false }) sortCashflow: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginatorCashflow: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginatorCompanyOwners: MatPaginator;


  // filters

  public filterFrom = null;
  public filterTo = null;
  public filterType = 'all';
  public filterKeyword = null;

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

  ngAfterContentInit() {
  }

  goBack() {
    this.router.navigate([this.authService.getPath('/companies')]);
  }

  loadCompany() {
    this.loadingData = true;
    this.apiService.getCompany(this.companyId).subscribe(response => {
      this.company = response.data.company;
      this.companyOwners = new MatTableDataSource(response.data.company.owners);
      this.companyOwners.sort = this.sortOwners;


      this.companyOffices = new MatTableDataSource(response.data.company.offices);
      this.companyOffices.sort = this.sortOffices;

      this.cashflow = new MatTableDataSource(response.data.company.cashflow);
      this.cashflow.sort = this.sortCashflow;
      this.cashflow.paginator = this.paginatorCashflow;
      this.filteredCashflow = response.data.company.cashflow;
      this.loadUsers();
      this.calculateMaxPercentageForOwner();
      this.loadingData = false;
      this.cashflowView = 'table';

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }
  loadUsers() {
    this.apiService.getUserList().subscribe(response => {
      this.allOwners = response.data.filter(u => u.role === 'Owner');
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
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
      this.notifyService.processError(error);
    });
  }

  addUser() {
    // this.addUserFormVisible = true;
    this.openOwnerPercentageDialog(undefined);
  }

  addOffice() {
    this.router.navigate([this.authService.getPath('/offices')]);
  }

  filter() {
    this.recreatedChart = false;
    let records = this.company.cashflow;
    if (this.filterFrom !== null) {
      records = records.filter(a => new Date(a.createdAt) > new Date(this.filterFrom));
    }
    if (this.filterTo !== null) {
      records = records.filter(a => new Date(a.createdAt) <= new Date(this.filterTo));
    }
    if (this.filterKeyword !== null) {
      const keyWord = this.filterKeyword.toLowerCase();
      records = records.filter(a => a.description.toLowerCase().includes(keyWord) ||
                                    a.creatorName.toLowerCase().includes(keyWord) ||
                                    (a.officeName !== null && a.officeName.toLowerCase().includes(keyWord)) ||
                                    a.amount.toString().toLowerCase().includes(keyWord));
    }
    if (this.filterType !== 'all') {
      if (this.filterType === 'company') {
        records = records.filter(a => a.type === 1 || a.type === 2);
      } else if (this.filterType === 'personal') {
        records = records.filter(a => a.type === 3 || a.type === 4);
      } else {
        records = records.filter(a => a.type === this.filterType);
      }
    }
    this.filteredCashflow = records;
    this.cashflow = new MatTableDataSource(records);
    this.cashflow.sort = this.sortCashflow;
    this.cashflow.paginator = this.paginatorCashflow;
    setTimeout(() => {
      this.recreatedChart = true;
    }, 100);
  }

  clearFilters() {
    this.filterFrom = null;
    this.filterTo = null;
    this.filterType = 'all';
    this.filterKeyword = null;
    this.filter();
  }

  removeCompanyUser(userId) {
    this.loadingData = true;
    this.apiService.removeUserFromCompany(this.companyId, userId).subscribe(response => {
      this.loadingData = false;
      this.loadCompany();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }
  removeCompanyOffice(office) {
    this.loadingData = true;
    this.apiService.removeOfficeFromCompany(office.officeId, this.companyId).subscribe(response => {
      this.loadingData = false;
      this.loadCompany();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  calculateMaxPercentageForOwner() {
    let totalPercentageSum = 0;
    this.company.owners.forEach(owner => {
      totalPercentageSum += owner.percentage;
    });
    this.maxNewOwnerPercentage = 100 - totalPercentageSum;
    this.newOwner.percentage = this.maxNewOwnerPercentage;
    if (this.maxNewOwnerPercentage > 0) {
      this.percentageNotFilledWarning = true;
    } else {
      this.percentageNotFilledWarning = false;
    }
  }

  addCompanyUser() {
    this.loadingData = true;
    this.newOwner.companyId = this.companyId;
    this.apiService.addUserToCompany(this.newOwner).subscribe(response => {
      this.newOwner = new CompanyOwnerAddModel();
      this.loadCompany();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  editCompanyUser() {
    this.loadingData = true;
    this.newOwner.companyId = this.companyId;
    this.apiService.editUserInCompany(this.newOwner).subscribe(response => {
      this.loadCompany();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  openOwnerPercentageDialog(element: any): void {
    const entryData = new PercentageSaveData();
    let isEdit = false;
    let headerText = 'add-owner';
    let maxPercentage = this.maxNewOwnerPercentage;
    let owners = this.allOwners.filter(u => this.company.owners.map(c => c.userId).includes(u.id) === false)
      .map(({ id, name, surname }) => ({ text: name + ' ' + surname, id: id }));
    if (element !== undefined) {
      entryData.selectedInput = element.userId;
      entryData.selectedType = element.role;
      entryData.percentage = element.percentage;
      isEdit = true;
      headerText = 'edit-owner';
      owners = [{ text: element.userName + ' ' + element.userSurname, id: element.userId }];
      maxPercentage += element.percentage;
    }
    const data: PercentageEntryData = {
      headerText: headerText,
      inputText: 'owner',
      typeText: 'role',
      percentageText: 'company-share-percentage',
      maxPercentage: maxPercentage,
      possibleData: owners,
      possibleTypes: [
        {
          text: 'EXECUTIVE',
          id: 1
        },
        {
          text: 'COMPANION',
          id: 2
        }
      ],
      entryData: entryData,
      isEdit: isEdit,
    };
    const dialogRef = this.dialog.open(PercentageDialogComponent, {
      data: data,
      position: { top: '80px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.newOwner.userId = result.selectedInput;
        this.newOwner.percentage = result.percentage;
        this.newOwner.role = result.selectedType;
        if (result.isEdit === true) {
          this.editCompanyUser();
        } else {
          this.addCompanyUser();
        }
      }
    });
  }

  openRemoveUserDialog(userId): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.translateService.instant('confirm-remove-owner'),
      position: { top: '80px' }
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
        data: this.translateService.instant('confirm-remove-office'),
        position: { top: '80px' }
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

  setDataSource(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 2:
          this.companyOwners.sort = this.sortOwners;
          !this.companyOwners.paginator ? this.companyOwners.paginator = this.paginatorCompanyOwners : null;
          break;
        case 3:
          this.cashflow.sort = this.sortCashflow;
          this.cashflow.paginator = this.paginatorCashflow;
      }
    }, 100);
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
  }
}

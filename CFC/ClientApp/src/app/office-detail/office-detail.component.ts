import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { CompanyOfficeAddModel } from '../models/company-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { OfficeStatus } from '../models/enums';
import { AuthService } from '../services/auth.service';
import { PercentageSaveData, PercentageEntryData } from '../models/percentage-models';
import { PercentageDialogComponent } from '../percentage-dialog/percentage-dialog.component';


@Component({
  selector: 'app-office-detail',
  templateUrl: './office-detail.component.html',
  styleUrls: ['./office-detail.component.scss']
})
export class OfficeDetailComponent implements OnInit {
  public selectedTab = 0;
  public officeId;
  public office ;
  public officeCompanies;
  public companies;

  public cashflow;
  public loadingData = false;
  public editMode = false;

  public maxNewCompanyPercentage;
  public newOfficeCompany;
  public officeStatuses = Object.keys(OfficeStatus).filter(s => Number.isNaN(Number(s)));
  public officeStatus = OfficeStatus;

  public percentageNotFilledWarning = false;
  public cashflowView;
  public recreatedChart = true;
  public filteredCashflow;

  public displayedColumnsCompanies: string[] = ['companyName', 'percentage', 'actions'];
  public displayedColumnsCashFlow: string[] = ['createdAt', 'creator', 'description', 'amount'];


  @ViewChild(MatSort, { static: false }) sortCompanies: MatSort;

  @ViewChild(MatSort, { static: false }) sortCashflow: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginatorCashflow: MatPaginator;


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
    private changeDetector: ChangeDetectorRef,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.officeId = this.route.snapshot.params.id;
    this.newOfficeCompany = new CompanyOfficeAddModel();
    this.loadOffice();
  }

  goBack() {
    this.router.navigate([this.authService.getPath('/offices/')]);
  }

  loadOffice() {
    this.apiService.getOffice(this.officeId).subscribe(response => {
      this.office = response.data.office;
      this.officeCompanies = new MatTableDataSource(response.data.office.companies);
      this.officeCompanies.sort = this.sortCompanies;

      this.cashflow = new MatTableDataSource(response.data.office.cashflow);
      this.cashflow.sort = this.sortCashflow;
      this.cashflow.paginator = this.paginator;
      this.filteredCashflow = response.data.office.cashflow;
      this.loadCompanies();
      this.calculateMaxPercentageForOwner();
      this.loadingData = false;
      this.changeDetector.detectChanges();
      this.cashflowView = 'table';

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }
  loadCompanies() {
    this.apiService.getCompanies().subscribe(response => {
      this.companies = response.data.companies;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  editOffice() {
    this.office.officeId = this.officeId;
    this.apiService.editOffice(this.office).subscribe(response => {
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.loadingData = false;
      this.editMode = false;
      this.loadOffice();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  filter() {
    this.recreatedChart = false;
    let records = this.office.cashflow;
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
                                    a.amount.toString().toLowerCase().includes(keyWord));
    }
    if (this.filterType !== 'all') {
        records = records.filter(a => a.type === Number(this.filterType));
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

  removeCompanyOffice(element) {
    this.loadingData = true;
    this.apiService.removeOfficeFromCompany(this.officeId, element.companyId).subscribe(response => {
      this.loadingData = false;
      this.loadOffice();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  calculateMaxPercentageForOwner() {
    let totalPercentageSum = 0;
    this.office.companies.forEach(company => {
      totalPercentageSum += company.percentage;
    });
    this.maxNewCompanyPercentage = 100 - totalPercentageSum;
    this.newOfficeCompany.percentage = this.maxNewCompanyPercentage;
    if (this.maxNewCompanyPercentage > 0) {
      this.percentageNotFilledWarning = true;
    } else {
      this.percentageNotFilledWarning = false;
    }
  }

  saveOfficeCompany() {
    this.loadingData = true;
    this.newOfficeCompany.officeId = this.officeId;
    this.apiService.addCompanyToOffice(this.newOfficeCompany).subscribe(response => {
      this.newOfficeCompany = new CompanyOfficeAddModel();
      this.loadOffice();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });

  }

  editOfficeCompany() {
    this.loadingData = true;
    this.newOfficeCompany.officeId = this.officeId;
    this.apiService.editCompanyInOffice(this.newOfficeCompany).subscribe(response => {
      this.newOfficeCompany = new CompanyOfficeAddModel();
      this.loadOffice();
    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });

  }

  openOfficeCompanyPercentageDialog(element: any): void {
    const entryData = new PercentageSaveData();
    let isEdit = false;
    let headerText = 'add-company';
    let maxPercentage = this.maxNewCompanyPercentage;
    let companies = this.companies.filter(u => this.office.companies.map(c => c.companyId).includes(u.id) === false)
                                .map(({ id, name }) => ({ text: name, id: id }));
    if (element !== undefined) {
      entryData.selectedInput = element.companyId;
      // entryData.selectedType = element.role;
      entryData.percentage = element.percentage;
      isEdit = true;
      headerText = 'edit-company';
      companies = [ { text: element.companyName , id: element.companyId}];
      maxPercentage += element.percentage;
    }
    const data: PercentageEntryData =  {
      headerText: headerText,
      inputText: 'company',
      typeText: null,
      percentageText: 'company-share-percentage',
      maxPercentage: maxPercentage,
      possibleData: companies,
      possibleTypes: [],
      entryData: entryData,
      isEdit: isEdit,
    };
    const dialogRef = this.dialog.open(PercentageDialogComponent, {
      data: data,
      position: { top: '80px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.newOfficeCompany.companyId = result.selectedInput;
        this.newOfficeCompany.percentage = result.percentage;
        if (result.isEdit === true) {
          this.editOfficeCompany();
        } else {
          this.saveOfficeCompany();
        }
      }
    });

  }


  openRemoveCompanyDialog(office): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.translateService.instant('confirm-remove-company'),
        position: { top: '80px' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.removeCompanyOffice(office);
        }
      });
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode === false) {
      this.loadOffice();
    }
  }

}

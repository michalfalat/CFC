import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../models/user-models';
import { CompanyOfficeAddModel } from '../models/company-models';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { OfficeStatus } from '../models/enums';


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
  public loadingData = false;
  public addCompanyFormVisible = false;
  public editMode = false;

  public maxNewCompanyPercentage;
  public newOfficeCompany;
  public officeStatuses = Object.keys(OfficeStatus).filter(s => Number.isNaN(Number(s)));
  public officeStatus = OfficeStatus;

  public displayedColumnsCompanies: string[] = ['companyName', 'companyIdentificationNumber', 'percentage', 'actions'];


  @ViewChild(MatSort, { read: false }) sortCompanies: MatSort;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.officeId = this.route.snapshot.params.id;
    this.newOfficeCompany = new CompanyOfficeAddModel();
    this.loadOffice();
    console.log(this.officeStatuses);
  }

  goBack() {
    this.router.navigate(['/admin/offices']);
  }

  loadOffice() {
    this.apiService.getOffice(this.officeId).subscribe(response => {
      console.log(response);
      this.office = response.data.office;
      this.officeCompanies = new MatTableDataSource(response.data.office.companies);
      this.officeCompanies.sort = this.sortCompanies;
      this.loadCompanies();
      this.calculateMaxPercentageForOwner();
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }
  loadCompanies() {
    this.apiService.getCompanies().subscribe(response => {
      this.companies = response.data.companies.filter(u => this.office.companies.map(c => c.companyId).includes(u.id) === false);
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

  addCompany() {
    this.addCompanyFormVisible = true;
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
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

  // addOffice() {
  //   this.router.navigate([`/admin/companies/${ this.companyId }/addOffice`]);
  // }


  removeCompanyOffice(element) {
    this.loadingData = true;
    this.apiService.removeOfficeFromCompany(this.officeId, element.companyId).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.loadOffice();
    }, error => {
      console.log(error);
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

  calculateMaxPercentageForOwner() {
    let totalPercentageSum = 0;
    this.office.companies.forEach(company => {
      totalPercentageSum += company.percentage;
    });
    this.maxNewCompanyPercentage = 100 - totalPercentageSum;
    this.newOfficeCompany.percentage = this.maxNewCompanyPercentage;
  }

  saveOfficeCompany() {
    this.loadingData = true;
    this.newOfficeCompany.officeId = this.officeId;
    this.apiService.addCompanyToOffice(this.newOfficeCompany).subscribe(response => {
      console.log(response);
      this.loadingData = false;
      this.newOfficeCompany = new CompanyOfficeAddModel();
      this.loadOffice();
      this.addCompanyFormVisible = false;
    }, error => {
      console.log(error);
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });

  }


  openRemoveCompanyDialog(office): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.translateService.instant('confirm-remove-company')
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.removeCompanyOffice(office);
        }
      });
  }

  toogleEditMode() {
    this.editMode = !this.editMode;
  }

}

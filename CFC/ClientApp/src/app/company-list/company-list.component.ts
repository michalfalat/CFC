import { Component, OnInit,  ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { CompanyStatus, CompanyUserRole } from '../models/enums';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  public loadingData = false;
  public companyList;

  public companyStatus = CompanyStatus;

  public companyOwnerRole = CompanyUserRole;
  public displayedColumns: string[] = ['name', 'identificationNumber', /*'registrationDate'*/'role', 'status' , 'branchesCount', 'ownersCount', 'actualMoneyState', 'actions'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService,
     private notifyService: NotifyService, private translateService: TranslateService,
     public languageService: LanguageService, public authService: AuthService) { }

  ngOnInit() {
    this.getCompanies();
  }

  refresh() {
    this.getCompanies();
  }

  getCompanies() {
    this.companyList = [];
    this.loadingData = true;
    this.apiService.getCompanies().subscribe(response => {
      this.companyList = new MatTableDataSource(response.data.companies);
      this.companyList.sort = this.sort;
      this.companyList.paginator = this.paginator;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
  }

  remove(element) {
    const id = element.id;
    const block  = element.obsolete ? false : true;
    this.loadingData = true;
    this.apiService.removeCompany(id, block).subscribe(response => {
      if (block) {
        this.notifyService.info(this.translateService.instant('company-blocked'));
      } else {
        this.notifyService.info(this.translateService.instant('company-unblocked'));
      }
     this.getCompanies();
    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
      this.loadingData = false;
    });
  }
}

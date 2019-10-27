import { Component, OnInit,  ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { CompanyStatus, CompanyUserRole } from '../models/enums';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
     public languageService: LanguageService, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getCompanies();
  }

  refresh() {
    this.getCompanies();
  }

  goToDetail(id) {
    this.router.navigate([this.authService.getPath('/companies/' + id) ]);
  }


  getCompanies() {
    this.loadingData = true;
    this.apiService.getCompanies().subscribe(response => {
      this.companyList = new MatTableDataSource(response.data.companies);
      this.companyList.sort = this.sort;
      this.companyList.paginator = this.paginator;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
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
      this.notifyService.processError(error);
      this.loadingData = false;
    });
  }
}

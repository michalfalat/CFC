import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  public loadingData = false;
  public companyList;
  public displayedColumns: string[] = ['name', 'identificationNumber', 'registrationDate', 'branchesCount', 'ownersCount', 'status', 'actions'];
  @ViewChild(MatSort, {read: false}) sort: MatSort;

  constructor(private apiService: ApiService, private ref: ChangeDetectorRef,
     private notifyService: NotifyService, private translateService: TranslateService) { }

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
      this.ref.detectChanges();
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
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
     this.getCompanies();
    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
      this.loadingData = false;
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-company-financials',
  templateUrl: './company-financials.component.html',
  styleUrls: ['./company-financials.component.scss']
})
export class CompanyFinancialsComponent implements OnInit {
  public loadingData = false;
  public recordList;
  public filteredCashflow;
  public allRecords;

  // filters

  public filterFrom = null;
  public filterTo = null;
  public filterType = 'all';
  public filterKeyword = null;
  public displayedColumns: string[] = ['createdAt', 'creator',  'companyName', 'officeName', 'description', 'amount', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService, public authService: AuthService,
    private notifyService: NotifyService, private translateService: TranslateService) { }

  ngOnInit() {
    this.getRecords();
  }

  refresh() {
    this.getRecords();
  }

  getRecords() {
    this.recordList = [];
    this.loadingData = true;
    this.apiService.getMoneyRecordsForCompany().subscribe(response => {
      console.log(response);
      this.recordList = new MatTableDataSource(response.data.records);
      this.recordList.sort = this.sort;
      this.recordList.paginator = this.paginator;
      this.filteredCashflow = response.data.records;
      this.allRecords = response.data.records;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  filter() {
    let records = this.allRecords;
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
                                    (a.companyName !== null && a.companyName.toLowerCase().includes(keyWord)) ||
                                    (a.officeName !== null && a.officeName.toLowerCase().includes(keyWord)) ||
                                    a.amount.toString().toLowerCase().includes(keyWord));
    }
    if (this.filterType !== 'all') {
        records = records.filter(a => a.type === Number(this.filterType));
    }
    this.filteredCashflow = records;
    this.recordList = new MatTableDataSource(records);
    this.recordList.sort = this.sort;
    this.recordList.paginator = this.paginator;
  }

  clearFilters() {
    this.filterFrom = null;
    this.filterTo = null;
    this.filterType = 'all';
    this.filterKeyword = null;
    this.filter();
  }

  // remove(element) {
  //   const id = element.id;
  //   const block  = element.obsolete ? false : true;
  //   this.loadingData = true;
  //   this.apiService.removeOffice(id, block).subscribe(response => {
  //     if (block) {
  //       this.notifyService.info(this.translateService.instant('office-blocked'));
  //     } else {
  //       this.notifyService.info(this.translateService.instant('company-unblocked'));
  //     }
  //    this.getRecords();
  //   }, error => {
  //     this.loadingData = false;
  //     this.notifyService.error(this.translateService.instant(error.error.errorLabel));
  //   });
  // }
}

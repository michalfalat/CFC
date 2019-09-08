import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MoneyRecordType } from '../models/enums';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-financials',
  templateUrl: './company-financials.component.html',
  styleUrls: ['./company-financials.component.scss']
})
export class CompanyFinancialsComponent implements OnInit {
  public loadingData = false;
  public recordList;
  public moneyRecordType = MoneyRecordType;
  public displayedColumns: string[] = ['createdAt', 'creator',  'companyName', 'officeName', 'description', 'amount', 'actions'];
  @ViewChild(MatSort, { read: false }) sort: MatSort;

  constructor(private apiService: ApiService,
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
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
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

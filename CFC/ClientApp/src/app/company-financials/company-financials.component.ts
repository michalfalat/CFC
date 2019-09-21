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
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
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

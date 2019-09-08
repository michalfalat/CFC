import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MoneyRecordType } from '../models/enums';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-financials',
  templateUrl: './personal-financials.component.html',
  styleUrls: ['./personal-financials.component.scss']
})
export class PersonalFinancialsComponent implements OnInit {
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
    this.apiService.getMoneyRecordsPersonal().subscribe(response => {
      console.log(response);
      this.recordList = new MatTableDataSource(response.data.records);
      this.recordList.sort = this.sort;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
  }

}

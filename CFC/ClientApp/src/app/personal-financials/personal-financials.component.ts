import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MoneyRecordType } from '../models/enums';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-personal-financials',
  templateUrl: './personal-financials.component.html',
  styleUrls: ['./personal-financials.component.scss']
})
export class PersonalFinancialsComponent implements OnInit {
  public loadingData = false;
  public recordList;
  public moneyRecordType = MoneyRecordType;
  public displayedColumns: string[] = ['createdAt', 'creator', 'description', 'amount', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService, private translateService: TranslateService,
    public authService: AuthService) { }

  ngOnInit() {
    this.getRecords();
  }

  refresh() {
    this.getRecords();
  }

  getRecords() {
    this.loadingData = true;
    this.apiService.getMoneyRecordsPersonal().subscribe(response => {
      console.log(response);
      this.recordList = [];
      this.recordList = response.data.records;
      // this.recordList.sort = this.sort;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
  }


  sumCompanyShare(company) {
    return (company.cashflow - company.allDeposit - company.allWithdraw)  / 100 * company.percentage;
  }


  finalSum(company) {
    return this.sumCompanyShare(company) + company.personalDeposit + company.personalWithdraw ;
  }

}

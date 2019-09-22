import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyRecordAddModel } from '../models/money-record-models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-company-financials-add',
  templateUrl: './company-financials-add.component.html',
  styleUrls: ['./company-financials-add.component.scss']
})
export class CompanyFinancialsAddComponent implements OnInit {

  public record: MoneyRecordAddModel;
  public companies: any[];
  public offices: any[];
  public loadingData = false;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute) {
      this.record = new MoneyRecordAddModel();
      this.record.type = 'income';

 }

  ngOnInit() {
    this.loadCompanies();
    this.loadOffices();
  }

  goBack() {
    this.router.navigate([this.authService.getPath('/companyRecords')]);
  }
  add() {
    this.loadingData = true;
    this.apiService.addMoneyRecord(this.record).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  loadCompanies() {
    this.loadingData = true;
    this.apiService.getCompanies().subscribe(response => {
      this.companies = response.data.companies;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  loadOffices() {
    this.loadingData = true;
    this.apiService.getOffices().subscribe(response => {
      this.offices = response.data.offices;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

}

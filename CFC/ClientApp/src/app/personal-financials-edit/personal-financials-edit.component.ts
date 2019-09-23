import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyRecordAddModel } from '../models/money-record-models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-personal-financials-edit',
  templateUrl: './personal-financials-edit.component.html',
  styleUrls: ['./personal-financials-edit.component.scss']
})
export class PersonalFinancialsEditComponent implements OnInit, AfterContentInit {


  public record: MoneyRecordAddModel;
  public recordId = null;
  public companyName;
  public loadingData = false;
  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute) {

 }

  ngOnInit() {
  }
  ngAfterContentInit() {
    this.record = new MoneyRecordAddModel();
    this.recordId = this.route.snapshot.params.id;
    this.loadRecord();

  }

  loadRecord() {
    this.apiService.getMoneyRecord(this.recordId).subscribe(response => {
      this.record = response.data.record;
      this.record.recordId = response.data.record.id;
      this.record.created =  response.data.record.createdAt;
      this.record.type = response.data.record.type === 3 ?  'withdraw' : 'deposit';
      this.loadCompanyPreview();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
      this.goBack();
    });
  }

  loadCompanyPreview() {
    this.apiService.getCompanyPreview(this.record.companyId).subscribe(response => {
      this.loadingData = false;
      this.companyName = response.data.company.name;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
      this.goBack();
    });
  }

  goBack() {
    this.router.navigate([this.authService.getPath(`/personalRecords`)]);
  }
  save() {
    this.loadingData = true;
    this.record.officeId = null;
    this.apiService.editMoneyRecord(this.record).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

}

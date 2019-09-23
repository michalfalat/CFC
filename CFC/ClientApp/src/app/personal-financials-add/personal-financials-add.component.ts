import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyRecordAddModel } from '../models/money-record-models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-personal-financials-add',
  templateUrl: './personal-financials-add.component.html',
  styleUrls: ['./personal-financials-add.component.scss']
})
export class PersonalFinancialsAddComponent implements OnInit, AfterContentInit {

  public record: MoneyRecordAddModel;
  public companyId = null;
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
    this.record.type = 'deposit';
    this.companyId = this.route.snapshot.params.id;
    this.loadCompanyPreview();

  }

  loadCompanyPreview(){
    this.apiService.getCompanyPreview(this.companyId).subscribe(response => {
      console.log(response.data);
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
  add() {
    this.loadingData = true;
    this.record.companyId = this.companyId;
    this.apiService.addMoneyRecord(this.record).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

}

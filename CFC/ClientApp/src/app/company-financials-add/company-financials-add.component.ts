import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyRecordAddModel } from '../models/money-record-models';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-company-financials-add',
  templateUrl: './company-financials-add.component.html',
  styleUrls: ['./company-financials-add.component.scss']
})
export class CompanyFinancialsAddComponent implements OnInit {

  public record: MoneyRecordAddModel;
  public companies: any[];
  public offices: any[];

  public labels: string[];
  public descriptionControl = new FormControl();
  public filteredLabels: Observable<string[]>;
  public loadingData = false;

  public editMode = false;

  private recordId = null;

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
    this.recordId = this.route.snapshot.params.id;
    this.loadCompanies();
    this.loadOffices();
    this.loadLabels();
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

  edit() {
    this.loadingData = true;
    this.record.recordId = this.recordId;
    this.apiService.editMoneyRecord(this.record).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  loadRecordForEdit() {
    this.loadingData = true;
    this.apiService.getMoneyRecord(this.recordId).subscribe(response => {
      this.record.companyId = response.data.record.companyId;
      this.record.officeId = response.data.record.officeId;
      this.record.description = response.data.record.description;
      this.record.created = response.data.record.createdAt;
      this.record.destinationType = response.data.record.officeId !== null ? 'office' : 'company';
      this.record.type = response.data.record.type === 1 ? 'expense' : 'income';
      this.record.amount = response.data.record.amount;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  loadLabels() {
    this.apiService.getMoneyRecordLabels().subscribe(response => {
      this.labels = response.data.labels;
      this.initAutocomplete();

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
      if (this.recordId !== undefined && this.recordId !== null) {
        this.editMode = true;
        this.loadRecordForEdit();
      }

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  initAutocomplete() {
    this.filteredLabels = this.descriptionControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.labels.filter(option => option.toLowerCase().includes(filterValue));
  }

}

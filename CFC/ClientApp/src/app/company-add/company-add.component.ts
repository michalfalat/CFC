import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CompanyAddModel } from '../models/company-models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit {
  public company: CompanyAddModel;
  public existingUserError: Boolean = false;
  public loadingData = false;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router) {
    this.company = new CompanyAddModel();
  }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate([this.authService.getPath('/companies')]);
  }
  add() {
    this.loadingData = true;
    this.existingUserError = false;
    this.apiService.addCompany(this.company).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }
}

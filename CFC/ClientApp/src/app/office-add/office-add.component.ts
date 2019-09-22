import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OfficeAddModel } from '../models/company-models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-office-add',
  templateUrl: './office-add.component.html',
  styleUrls: ['./office-add.component.scss']
})
export class OfficeAddComponent implements OnInit {
  public office: OfficeAddModel;

  public companyId;
  public companyName;
  public loadingData = false;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.office = new OfficeAddModel();

    // this.apiService.getCompanyPreview(this.companyId).subscribe(response => {
    //   this.loadingData = false;
    //   this.companyName = response.data.company.name;

    // }, error => {
    //   this.loadingData = false;
    //   console.log(error);
    //   this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    //   this.goBack();
    // });
  }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate([this.authService.getPath(`/offices`)]);
  }
  add() {
    this.loadingData = true;
    this.apiService.addOffice(this.office).subscribe(response => {
      this.loadingData = false;
      this.notifyService.info(this.translateService.instant('data-saved'));
      this.goBack();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

}

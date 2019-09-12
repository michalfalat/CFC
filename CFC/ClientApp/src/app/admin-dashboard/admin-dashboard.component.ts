import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public loadingData = true;

  public data;
  constructor(private apiService: ApiService, private notifyService: NotifyService, private translateService: TranslateService) { }

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  loadData() {
    this.loadingData = true;
    this.apiService.getAdminDashboard().subscribe(response => {
      this.data = response.data.data;
      console.log(response);
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      console.log(error);
      this.notifyService.error(this.translateService.instant(error.error.errorLabel.value));
    });
  }

}

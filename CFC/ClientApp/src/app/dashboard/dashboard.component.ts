import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import moment = require('moment');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public currentMonth: any;
  public loadingData = true;
  public data;
  constructor(private apiService: ApiService, private notifyService: NotifyService, private translateService: TranslateService) {
    const options = {  year: 'numeric', month: 'long' };
    this.currentMonth = `${ new Date().toLocaleString('default', { month: 'long' }) } ${ new Date().getFullYear()}`;
  }

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  loadData() {
    this.loadingData = true;
    this.apiService.getUserDashboard().subscribe(response => {
      this.data = response.data.data;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

}

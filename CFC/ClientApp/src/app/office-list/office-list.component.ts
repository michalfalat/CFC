import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { OfficeStatus } from '../models/enums';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss']
})
export class OfficeListComponent implements OnInit {

  public loadingData = false;

  public currentDateFormat = "";
  public officeList;
  public officeStatus = OfficeStatus;
  public displayedColumns: string[] = ['name', 'description', 'registrationDate', 'status', 'companiesCount', 'actualMoneyState', 'actions'];
  @ViewChild(MatSort, {read: false}) sort: MatSort;

  constructor(private apiService: ApiService,
     private notifyService: NotifyService, private translateService: TranslateService, private languageService: LanguageService) {
     }

  ngOnInit() {
    this.getOffices();
  }

  refresh() {
    this.getOffices();
  }

  getOffices() {
    this.officeList = [];
    this.loadingData = true;
    this.apiService.getOffices().subscribe(response => {
      console.log(response);
      this.officeList = new MatTableDataSource(response.data.offices);
      this.officeList.sort = this.sort;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
    });
  }

  remove(element) {
    const id = element.id;
    const block  = element.obsolete ? false : true;
    this.loadingData = true;
    this.apiService.removeOffice(id, block).subscribe(response => {
      if (block) {
        this.notifyService.info(this.translateService.instant('office-blocked'));
      } else {
        this.notifyService.info(this.translateService.instant('company-unblocked'));
      }
     this.getOffices();
    }, error => {
      this.notifyService.error(this.translateService.instant(error.error.errorLabel));
      this.loadingData = false;
    });
  }

}

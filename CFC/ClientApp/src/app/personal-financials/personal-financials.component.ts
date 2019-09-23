import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-personal-financials',
  templateUrl: './personal-financials.component.html',
  styleUrls: ['./personal-financials.component.scss']
})
export class PersonalFinancialsComponent implements OnInit {
  public loadingData = false;
  public recordList;
  public displayedColumns: string[] = ['createdAt', 'creator', 'description', 'amount', 'actions'];
  public selectedTab;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService,
    private notifyService: NotifyService, private translateService: TranslateService,
    public authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.getRecords();
    this.setTab();
  }

  refresh() {
    this.getRecords();
  }

  getRecords() {
    this.loadingData = true;
    const scrollPosition = window.scrollY;
    console.log(scrollPosition);
    this.apiService.getMoneyRecordsPersonal().subscribe(response => {
      this.recordList = response.data.records;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  setTab() {
    if (this.authService.getRole() === 'Administrator') {
      this.selectedTab = 1;
    } else {
      this.selectedTab = 0;
    }
  }

  removeRecord(id) {
    this.apiService.removeMoneyRecord(id).subscribe(response => {
      this.getRecords();

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  openRemoveRecordDialog(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.translateService.instant('confirm-remove-record'),
      position: { top: '80px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeRecord(element.id);
      }
    });
  }

  edit(element) {
    this.router.navigate([this.authService.getPath(`/personalRecords/edit/${element.id}`)]);
  }


  sumCompanyShare(company) {
    return Number((company.cashflow - company.allDeposit - company.allWithdraw)  / 100 * company.percentage).toFixed(2);
  }


  finalSum(company) {
    return Number(Number(this.sumCompanyShare(company)) + company.personalDeposit + company.personalWithdraw).toFixed(2);
  }

}

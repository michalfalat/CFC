import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { NotifyService } from '../services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-company-financials',
  templateUrl: './company-financials.component.html',
  styleUrls: ['./company-financials.component.scss'],
   animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('collapsed <=> expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CompanyFinancialsComponent implements OnInit {
  public loadingData = false;
  public recordList;
  public filteredCashflow;
  public allRecords;

  public expandedElement: any;

  // filters

  public filterFrom = null;
  public filterTo = null;
  public filterType = 'all';
  public filterKeyword = null;
  public displayedColumns: string[] = ['createdAt', 'creator', 'companyName', 'officeName', 'description', 'amount', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private apiService: ApiService, public authService: AuthService, private router: Router,
    private notifyService: NotifyService, private translateService: TranslateService, public dialog: MatDialog) { }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  ngOnInit() {
    this.getRecords();
  }

  refresh() {
    this.getRecords();
  }

  getRecords() {
    // this.recordList = [];
    this.loadingData = true;
    this.apiService.getMoneyRecordsForCompany().subscribe(response => {
      this.recordList = new MatTableDataSource(response.data.records);
      this.recordList.sort = this.sort;
      this.recordList.paginator = this.paginator;
      this.filteredCashflow = response.data.records;
      this.allRecords = response.data.records;
      this.loadingData = false;

    }, error => {
      this.loadingData = false;
      this.notifyService.processError(error);
    });
  }

  filter() {
    let records = this.allRecords;
    if (this.filterFrom !== null) {
      records = records.filter(a => new Date(a.createdAt) > new Date(this.filterFrom));
    }
    if (this.filterTo !== null) {
      records = records.filter(a => new Date(a.createdAt) <= new Date(this.filterTo));
    }
    if (this.filterKeyword !== null) {
      const keyWord = this.filterKeyword.toLowerCase();
      records = records.filter(a => a.description.toLowerCase().includes(keyWord) ||
        a.creatorName.toLowerCase().includes(keyWord) ||
        (a.companyName !== null && a.companyName.toLowerCase().includes(keyWord)) ||
        (a.officeName !== null && a.officeName.toLowerCase().includes(keyWord)) ||
        a.amount.toString().toLowerCase().includes(keyWord));
    }
    if (this.filterType !== 'all') {
      records = records.filter(a => a.type === Number(this.filterType));
    }
    this.filteredCashflow = records;
    this.recordList = new MatTableDataSource(records);
    this.recordList.sort = this.sort;
    this.recordList.paginator = this.paginator;
  }

  clearFilters() {
    this.filterFrom = null;
    this.filterTo = null;
    this.filterType = 'all';
    this.filterKeyword = null;
    this.filter();
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

  rowClicked(element){
    if (window.innerWidth < 1000) {
      this.expandedElement = this.expandedElement === element ? null : element;
    } else {
      this.expandedElement = null;
      this.edit(element);
    }
  }

  edit(element) {
    this.router.navigate([this.authService.getPath(`/companyRecords/edit/${ element.id }`)]);
  }
}

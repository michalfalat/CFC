import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorIntlService extends MatPaginatorIntl {
  translate: TranslateService;
  itemsPerPageLabel = 'Items per page';
  nextPageLabel     = 'Next page';
  previousPageLabel = 'Previous page';
  firstPageLabel = 'First page';
  lastPageLabel = 'Last page';

  getRangeLabel = function (page, pageSize, length) {
    const ofStr = this.translate ? this.translate.instant('paginator.of') : 'of';
    if (length === 0 || pageSize === 0) {
      return '0 ' + ofStr + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + ofStr + ' ' + length;
  };

  injectTranslateService(translate: TranslateService) {
    this.translate = translate;

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('paginator.items-per-page');
    this.nextPageLabel = this.translate.instant('paginator.next-page');
    this.previousPageLabel = this.translate.instant('paginator.previous-page');
    this.firstPageLabel = this.translate.instant('paginator.first-page');
    this.lastPageLabel = this.translate.instant('paginator.last-page');
    this.changes.next();
  }

}

import { TestBed, inject } from '@angular/core/testing';

import { NotifyService } from './notify.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateService, TranslateStore, TranslateModule } from '@ngx-translate/core';

describe('NotifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotifyService, TranslateService, TranslateStore],
      imports: [MatSnackBarModule, TranslateModule.forRoot()]
    });
  });

  it('should be created', inject([NotifyService], (service: NotifyService) => {
    expect(service).toBeTruthy();
  }));
});

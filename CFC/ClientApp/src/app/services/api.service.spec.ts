import { TestBed, inject } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from './notify.service';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] },
      NotifyService,
      MatSnackBar, Overlay],
      imports: [ HttpClientModule, TranslateModule.forRoot()]
    });
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});

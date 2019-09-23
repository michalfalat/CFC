import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [AuthService, NotifyService, MatSnackBar, Overlay]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});

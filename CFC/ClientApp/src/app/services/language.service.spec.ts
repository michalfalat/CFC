import { TestBed, inject } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

describe('LanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService
      ],
      imports: [
        TranslateModule.forRoot(),
      ]
    });
  });

  it('should be created', inject([LanguageService], (service: LanguageService) => {
    expect(service).toBeTruthy();
  }));
});

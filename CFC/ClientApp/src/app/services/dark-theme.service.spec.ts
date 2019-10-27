import { TestBed, inject } from '@angular/core/testing';

import { DarkThemeService } from './dark-theme.service';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from 'ng2-charts';

describe('DarkThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DarkThemeService, CookieService, ThemeService]
    });
  });

  it('should be created', inject([DarkThemeService], (service: DarkThemeService) => {
    expect(service).toBeTruthy();
  }));
});

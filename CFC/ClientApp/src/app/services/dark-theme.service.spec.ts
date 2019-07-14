import { TestBed, inject } from '@angular/core/testing';

import { DarkThemeService } from './dark-theme.service';

describe('DarkThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DarkThemeService]
    });
  });

  it('should be created', inject([DarkThemeService], (service: DarkThemeService) => {
    expect(service).toBeTruthy();
  }));
});

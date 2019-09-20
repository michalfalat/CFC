import { TestBed, inject } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] }],
      imports: [ HttpClientModule]
    });
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFinancialsAddComponent } from './company-financials-add.component';

describe('CompanyFinancialsAddComponent', () => {
  let component: CompanyFinancialsAddComponent;
  let fixture: ComponentFixture<CompanyFinancialsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFinancialsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinancialsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

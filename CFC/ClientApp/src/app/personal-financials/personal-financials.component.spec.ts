import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalFinancialsComponent } from './personal-financials.component';

describe('PersonalFinancialsComponent', () => {
  let component: PersonalFinancialsComponent;
  let fixture: ComponentFixture<PersonalFinancialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalFinancialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

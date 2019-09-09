import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalFinancialsAddComponent } from './personal-financials-add.component';

describe('PersonalFinancialsAddComponent', () => {
  let component: PersonalFinancialsAddComponent;
  let fixture: ComponentFixture<PersonalFinancialsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalFinancialsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFinancialsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

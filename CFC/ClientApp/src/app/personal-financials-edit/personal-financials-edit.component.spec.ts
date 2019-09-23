import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalFinancialsEditComponent } from './personal-financials-edit.component';

describe('PersonalFinancialsEditComponent', () => {
  let component: PersonalFinancialsEditComponent;
  let fixture: ComponentFixture<PersonalFinancialsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalFinancialsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFinancialsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

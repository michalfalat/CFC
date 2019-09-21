import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageDialogComponent } from './percentage-dialog.component';

describe('PercentageDialogComponent', () => {
  let component: PercentageDialogComponent;
  let fixture: ComponentFixture<PercentageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

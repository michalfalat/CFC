import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDataComponent } from './chart-data.component';

describe('ChartDataComponent', () => {
  let component: ChartDataComponent;
  let fixture: ComponentFixture<ChartDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDataComponent } from './chart-data.component';
import { CustomMaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { CookieService } from 'ngx-cookie-service';

describe('ChartDataComponent', () => {
  let component: ChartDataComponent;
  let fixture: ComponentFixture<ChartDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDataComponent ],
      imports: [
        TranslateModule.forRoot(),
        CustomMaterialModule,
        FormsModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        ChartsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] },
        CookieService
      ]
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyFinancialsAddComponent } from './company-financials-add.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CompanyFinancialsAddComponent', () => {
  let component: CompanyFinancialsAddComponent;
  let fixture: ComponentFixture<CompanyFinancialsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFinancialsAddComponent ],
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
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] }
      ]
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

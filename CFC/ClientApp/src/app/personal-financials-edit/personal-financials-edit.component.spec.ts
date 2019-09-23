import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { PersonalFinancialsComponent } from '../personal-financials/personal-financials.component';
import { PersonalFinancialsEditComponent } from './personal-financials-edit.component';

describe('PersonalFinancialsEditComponent', () => {
  let component: PersonalFinancialsEditComponent;
  let fixture: ComponentFixture<PersonalFinancialsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalFinancialsEditComponent, PersonalFinancialsComponent ],
      imports: [
        TranslateModule.forRoot(),
        CustomMaterialModule,
        FormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'personalRecords', component: PersonalFinancialsComponent}]
        ),
        HttpClientModule,
        ChartsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] },
        CookieService
      ]
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

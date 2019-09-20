import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './register.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

describe('RegisterComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserComponent ],
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
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

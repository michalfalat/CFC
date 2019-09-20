import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditComponent ],
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
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

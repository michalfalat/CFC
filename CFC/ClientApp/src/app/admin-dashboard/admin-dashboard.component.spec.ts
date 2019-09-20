import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { getBaseUrl } from 'src/main';


describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [
        TranslateModule.forRoot(),
        CustomMaterialModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href, deps: [] }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

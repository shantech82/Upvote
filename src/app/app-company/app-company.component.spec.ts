import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCompanyComponent } from './app-company.component';

describe('AppCompanyComponent', () => {
  let component: AppCompanyComponent;
  let fixture: ComponentFixture<AppCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

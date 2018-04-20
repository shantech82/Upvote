import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCompanylistComponent } from './app-companylist.component';

describe('AppCompanylistComponent', () => {
  let component: AppCompanylistComponent;
  let fixture: ComponentFixture<AppCompanylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCompanylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

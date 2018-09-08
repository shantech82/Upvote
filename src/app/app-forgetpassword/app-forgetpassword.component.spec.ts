import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppForgetpasswordComponent } from './app-forgetpassword.component';

describe('AppForgetpasswordComponent', () => {
  let component: AppForgetpasswordComponent;
  let fixture: ComponentFixture<AppForgetpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppForgetpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppForgetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

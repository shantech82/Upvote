import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIcocompanyComponent } from './app-icocompany.component';

describe('AppIcocompanyComponent', () => {
  let component: AppIcocompanyComponent;
  let fixture: ComponentFixture<AppIcocompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIcocompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIcocompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

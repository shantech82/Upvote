import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppActivateComponent } from './app-activate.component';

describe('AppActivateComponent', () => {
  let component: AppActivateComponent;
  let fixture: ComponentFixture<AppActivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

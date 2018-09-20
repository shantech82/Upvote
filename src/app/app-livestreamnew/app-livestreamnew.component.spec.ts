import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLivestreamnewComponent } from './app-livestreamnew.component';

describe('AppLivestreamnewComponent', () => {
  let component: AppLivestreamnewComponent;
  let fixture: ComponentFixture<AppLivestreamnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLivestreamnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLivestreamnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

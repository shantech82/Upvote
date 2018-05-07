import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVideoComponent } from './app-video.component';

describe('AppVideoComponent', () => {
  let component: AppVideoComponent;
  let fixture: ComponentFixture<AppVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

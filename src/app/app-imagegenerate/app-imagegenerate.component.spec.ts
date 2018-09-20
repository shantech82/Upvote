import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppImagegenerateComponent } from './app-imagegenerate.component';

describe('AppImagegenerateComponent', () => {
  let component: AppImagegenerateComponent;
  let fixture: ComponentFixture<AppImagegenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppImagegenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppImagegenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

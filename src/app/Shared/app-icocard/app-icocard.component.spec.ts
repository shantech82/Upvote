import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIcocardComponent } from './app-icocard.component';

describe('AppIcocardComponent', () => {
  let component: AppIcocardComponent;
  let fixture: ComponentFixture<AppIcocardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIcocardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIcocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

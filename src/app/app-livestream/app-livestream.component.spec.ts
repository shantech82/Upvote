import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLivestreamComponent } from './app-livestream.component';

describe('AppLivestreamComponent', () => {
  let component: AppLivestreamComponent;
  let fixture: ComponentFixture<AppLivestreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLivestreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLivestreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

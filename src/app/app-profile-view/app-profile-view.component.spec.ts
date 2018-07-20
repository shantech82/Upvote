import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProfileViewComponent } from './app-profile-view.component';

describe('AppProfileViewComponent', () => {
  let component: AppProfileViewComponent;
  let fixture: ComponentFixture<AppProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

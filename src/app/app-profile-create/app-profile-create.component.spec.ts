import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProfileCreateComponent } from './app-profile-create.component';

describe('AppProfileCreateComponent', () => {
  let component: AppProfileCreateComponent;
  let fixture: ComponentFixture<AppProfileCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppProfileCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

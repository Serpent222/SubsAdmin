import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAdminComponent } from './update-user-admin.component';

describe('UpdateUserAdminComponent', () => {
  let component: UpdateUserAdminComponent;
  let fixture: ComponentFixture<UpdateUserAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

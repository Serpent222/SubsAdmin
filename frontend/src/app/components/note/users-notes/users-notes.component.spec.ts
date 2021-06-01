import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNotesComponent } from './users-notes.component';

describe('Users Notes Component', () => {
  let component: UsersNotesComponent;
  let fixture: ComponentFixture<UsersNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

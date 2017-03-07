import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardRegistrationComponent } from './board-registration.component';

describe('BoardRegistrationComponent', () => {
  let component: BoardRegistrationComponent;
  let fixture: ComponentFixture<BoardRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

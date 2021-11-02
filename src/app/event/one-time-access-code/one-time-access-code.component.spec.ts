import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeAccessCodeComponent } from './one-time-access-code.component';

describe('OneTimeAccessCodeComponent', () => {
  let component: OneTimeAccessCodeComponent;
  let fixture: ComponentFixture<OneTimeAccessCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneTimeAccessCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTimeAccessCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

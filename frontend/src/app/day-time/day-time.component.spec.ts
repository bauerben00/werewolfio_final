import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayTimeComponent} from './day-time.component';

describe('DayTimeComponent', () => {
  let component: DayTimeComponent;
  let fixture: ComponentFixture<DayTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayTimeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

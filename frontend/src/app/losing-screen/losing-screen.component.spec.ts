import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LosingScreenComponent } from './losing-screen.component';

describe('LosingScreenComponent', () => {
  let component: LosingScreenComponent;
  let fixture: ComponentFixture<LosingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LosingScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LosingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

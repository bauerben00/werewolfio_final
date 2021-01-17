import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscussionTimeComponent} from './discussion-time.component';

describe('DiscussionTimeComponent', () => {
  let component: DiscussionTimeComponent;
  let fixture: ComponentFixture<DiscussionTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscussionTimeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

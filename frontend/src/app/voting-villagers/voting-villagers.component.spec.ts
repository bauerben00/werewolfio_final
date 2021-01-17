import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VotingVillagersComponent} from './voting-villagers.component';

describe('VotingVillagersComponent', () => {
  let component: VotingVillagersComponent;
  let fixture: ComponentFixture<VotingVillagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VotingVillagersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingVillagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

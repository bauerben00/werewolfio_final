import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VotingWerewolvesComponent} from './voting-werewolves.component';

describe('VotingWerewolvesComponent', () => {
  let component: VotingWerewolvesComponent;
  let fixture: ComponentFixture<VotingWerewolvesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VotingWerewolvesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingWerewolvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

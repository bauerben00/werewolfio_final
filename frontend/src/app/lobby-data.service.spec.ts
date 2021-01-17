import {TestBed} from '@angular/core/testing';

import {LobbyDataService} from './lobby-data.service';

describe('LobbyDataService', () => {
  let service: LobbyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChooseSessionsService } from './choose-sessions.service';

describe('ChooseSessionsService', () => {
  let service: ChooseSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChooseSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

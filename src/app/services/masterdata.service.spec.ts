import { TestBed, inject } from '@angular/core/testing';

import { MasterdataService } from './masterdata.service';

describe('MasterdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterdataService]
    });
  });

  it('should be created', inject([MasterdataService], (service: MasterdataService) => {
    expect(service).toBeTruthy();
  }));
});

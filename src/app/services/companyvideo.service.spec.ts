import { TestBed, inject } from '@angular/core/testing';

import { CompanyvideoService } from './companyvideo.service';

describe('CompanyvideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyvideoService]
    });
  });

  it('should be created', inject([CompanyvideoService], (service: CompanyvideoService) => {
    expect(service).toBeTruthy();
  }));
});

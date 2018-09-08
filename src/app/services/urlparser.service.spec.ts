import { TestBed, inject } from '@angular/core/testing';

import { UrlparserService } from './urlparser.service';

describe('UrlparserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlparserService]
    });
  });

  it('should be created', inject([UrlparserService], (service: UrlparserService) => {
    expect(service).toBeTruthy();
  }));
});

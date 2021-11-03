import { TestBed } from '@angular/core/testing';

import { OnetimeaccesscodeService } from './onetimeaccesscode.service';

describe('OnetimeaccesscodeService', () => {
  let service: OnetimeaccesscodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnetimeaccesscodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PrakerinServiceService } from './prakerin.service.service';

describe('PrakerinServiceService', () => {
  let service: PrakerinServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrakerinServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

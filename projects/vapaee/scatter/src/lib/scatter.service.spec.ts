import { TestBed, inject } from '@angular/core/testing';

import { ScatterService } from './scatter.service';

describe('ScatterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScatterService]
    });
  });

  it('should be created', inject([ScatterService], (service: ScatterService) => {
    expect(service).toBeTruthy();
  }));
});

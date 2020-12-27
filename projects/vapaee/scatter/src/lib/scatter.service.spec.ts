import { TestBed, inject } from '@angular/core/testing';

import { VapaeeScatter } from './scatter.service';

describe('VapaeeScatter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VapaeeScatter]
    });
  });

  it('should be created', inject([VapaeeScatter], (service: VapaeeScatter) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { VapaeeScatter2 } from './scatter2.service';

describe('VapaeeScatter2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VapaeeScatter2]
    });
  });

  it('should be created', inject([VapaeeScatter2], (service: VapaeeScatter2) => {
    expect(service).toBeTruthy();
  }));
});

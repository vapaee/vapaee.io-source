
import { TestBed, inject } from '@angular/core/testing';

import { Feedback } from './feedback.service';

describe('Feedback', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Feedback]
    });
  });

  it('should be created', inject([Feedback], (service: Feedback) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, async, inject } from '@angular/core/testing';

import { NeworderGuard } from './neworder.guard';

describe('NeworderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeworderGuard]
    });
  });

  it('should ...', inject([NeworderGuard], (guard: NeworderGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed, async, inject } from '@angular/core/testing';

import { ApproveGuard } from './approve.guard';

describe('ApproveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApproveGuard]
    });
  });

  it('should ...', inject([ApproveGuard], (guard: ApproveGuard) => {
    expect(guard).toBeTruthy();
  }));
});

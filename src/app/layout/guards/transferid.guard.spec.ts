import { TestBed, async, inject } from '@angular/core/testing';

import { TransferidGuard } from './transferid.guard';

describe('TransferidGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferidGuard]
    });
  });

  it('should ...', inject([TransferidGuard], (guard: TransferidGuard) => {
    expect(guard).toBeTruthy();
  }));
});

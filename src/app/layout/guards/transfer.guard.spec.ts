import { TestBed, async, inject } from '@angular/core/testing';

import { TransferGuard } from './transfer.guard';

describe('TransferGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferGuard]
    });
  });

  it('should ...', inject([TransferGuard], (guard: TransferGuard) => {
    expect(guard).toBeTruthy();
  }));
});

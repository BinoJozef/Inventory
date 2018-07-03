import { TestBed, async, inject } from '@angular/core/testing';

import { InventoryGuard } from './inventory.guard';

describe('InventoryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventoryGuard]
    });
  });

  it('should ...', inject([InventoryGuard], (guard: InventoryGuard) => {
    expect(guard).toBeTruthy();
  }));
});

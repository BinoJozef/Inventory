import { TestBed, async, inject } from '@angular/core/testing';

import { OrderidGuard } from './orderid.guard';

describe('OrderidGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderidGuard]
    });
  });

  it('should ...', inject([OrderidGuard], (guard: OrderidGuard) => {
    expect(guard).toBeTruthy();
  }));
});

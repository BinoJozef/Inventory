import { OrderGuard } from './order.guard';
import { TestBed, async, inject } from '@angular/core/testing';



describe('OrderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderGuard]
    });
  });

  it('should ...', inject([OrderGuard], (guard: OrderGuard) => {
    expect(guard).toBeTruthy();
  }));
});

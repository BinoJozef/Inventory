import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryoperationComponent } from './inventoryoperation.component';

describe('InventoryoperationComponent', () => {
  let component: InventoryoperationComponent;
  let fixture: ComponentFixture<InventoryoperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryoperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryoperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

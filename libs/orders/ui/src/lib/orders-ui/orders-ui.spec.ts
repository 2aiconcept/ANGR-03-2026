import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersUi } from './orders-ui';

describe('OrdersUi', () => {
  let component: OrdersUi;
  let fixture: ComponentFixture<OrdersUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersUi],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

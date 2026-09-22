import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersUtil } from './orders-util';

describe('OrdersUtil', () => {
  let component: OrdersUtil;
  let fixture: ComponentFixture<OrdersUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersUtil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

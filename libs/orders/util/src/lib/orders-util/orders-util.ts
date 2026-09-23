import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-orders-util',
  imports: [],
  templateUrl: './orders-util.html',
  styleUrl: './orders-util.css',
})
export class OrdersUtil {}

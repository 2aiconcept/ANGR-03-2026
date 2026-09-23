import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-list-orders',
  imports: [],
  templateUrl: './page-list-orders.html',
  styleUrl: './page-list-orders.css',
})
export class PageListOrders {}

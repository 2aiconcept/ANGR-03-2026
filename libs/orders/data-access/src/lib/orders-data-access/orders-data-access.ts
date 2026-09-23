import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-orders-data-access',
  imports: [],
  templateUrl: './orders-data-access.html',
  styleUrl: './orders-data-access.css',
})
export class OrdersDataAccess {}

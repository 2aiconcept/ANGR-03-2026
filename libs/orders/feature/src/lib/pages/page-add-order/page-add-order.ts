import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-add-order',
  imports: [],
  templateUrl: './page-add-order.html',
  styleUrl: './page-add-order.css',
})
export class PageAddOrder {}

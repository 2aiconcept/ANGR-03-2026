import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-edit-order',
  imports: [],
  templateUrl: './page-edit-order.html',
  styleUrl: './page-edit-order.css',
})
export class PageEditOrder {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-order',
  imports: [],
  templateUrl: './form-order.html',
  styleUrl: './form-order.css',
})
export class FormOrder {}

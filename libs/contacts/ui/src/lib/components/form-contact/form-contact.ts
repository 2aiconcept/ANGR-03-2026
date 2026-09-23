import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-contact',
  imports: [],
  templateUrl: './form-contact.html',
  styleUrl: './form-contact.css',
})
export class FormContact {}

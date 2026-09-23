import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-add-contact',
  imports: [],
  templateUrl: './page-add-contact.html',
  styleUrl: './page-add-contact.css',
})
export class PageAddContact {}

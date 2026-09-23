import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-list-contacts',
  imports: [],
  templateUrl: './page-list-contacts.html',
  styleUrl: './page-list-contacts.css',
})
export class PageListContacts {}

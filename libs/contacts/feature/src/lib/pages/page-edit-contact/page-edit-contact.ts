import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-edit-contact',
  imports: [],
  templateUrl: './page-edit-contact.html',
  styleUrl: './page-edit-contact.css',
})
export class PageEditContact {}

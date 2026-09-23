import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contacts-util',
  imports: [],
  templateUrl: './contacts-util.html',
  styleUrl: './contacts-util.css',
})
export class ContactsUtil {}

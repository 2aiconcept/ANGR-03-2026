import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contacts-data-access',
  imports: [],
  templateUrl: './contacts-data-access.html',
  styleUrl: './contacts-data-access.css',
})
export class ContactsDataAccess {}

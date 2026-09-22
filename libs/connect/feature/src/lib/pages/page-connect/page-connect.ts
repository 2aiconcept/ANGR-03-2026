import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormConnect } from '@mini-crm/connect/ui';
import { Auth } from '@mini-crm/shared/data-access';

@Component({
  selector: 'app-page-connect',
  imports: [FormConnect],
  templateUrl: './page-connect.html',
  styleUrl: './page-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConnect {
  protected readonly auth = inject(Auth);



  


}

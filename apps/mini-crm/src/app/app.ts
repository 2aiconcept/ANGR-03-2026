import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav, Header } from '@mini-crm/shared/ui';
import { Auth } from '@mini-crm/shared/data-access';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // inject le service auth to get isAuthendicated property and use it in html
  protected readonly auth = inject(Auth);
}

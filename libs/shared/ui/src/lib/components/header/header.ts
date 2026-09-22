import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '@mini-crm/shared/util';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  /** Utilisateur à afficher, ou null si personne n'est connecté. */
  readonly user = input<User | null>(null);

  /** Émis quand l'utilisateur clique sur le bouton de déconnexion. */
  readonly logout = output<void>();

  protected onLogoutClick(): void {
    this.logout.emit();
  }
}

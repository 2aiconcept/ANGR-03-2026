import { ChangeDetectionStrategy, Component, DOCUMENT, inject, input, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { User } from '@mini-crm/shared/util';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe, UpperCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  /** Utilisateur à afficher, ou null si personne n'est connecté. */
  readonly user = input<User | null>(null);

  /** Émis quand l'utilisateur clique sur le bouton de déconnexion. */
  readonly logout = output<void>();

  /** Langues proposées et langue affichée en ce moment. */
  protected readonly langs = ['fr', 'en'];
  protected readonly activeLang = this.transloco.activeLang;

  protected onLogoutClick(): void {
    this.logout.emit();
  }

  /** Change la langue de l'app, et l'attribut lang de la page pour les lecteurs d'écran. */
  protected changeLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.document.documentElement.lang = lang;
  }
}

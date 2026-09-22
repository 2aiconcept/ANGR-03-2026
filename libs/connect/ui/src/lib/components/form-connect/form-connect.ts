import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { Credentials, RegisterPayload } from '@mini-crm/shared/util';

type ConnectMode = 'signin' | 'signup';
const PASSWORD_MIN_LENGTH = 6;

@Component({
  selector: 'app-form-connect',
  imports: [FormField],
  templateUrl: './form-connect.html',
  styleUrl: './form-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConnect {
  /** Message d'erreur renvoyé par le parent (ex. identifiants incorrects), affiché sous le formulaire. */
  readonly error = input<string | null>(null);

  /** Émis avec les identifiants saisis quand l'utilisateur soumet en mode connexion. */
  readonly signin = output<Credentials>();

  /** Émis avec les données d'inscription saisies quand l'utilisateur soumet en mode inscription. */
  readonly signup = output<RegisterPayload>();

  /** Mode courant : connexion (par défaut) ou inscription. */
  protected readonly mode = signal<ConnectMode>('signin');

  /** Bascule entre le formulaire de connexion et celui d'inscription. */
  protected toggleMode(): void {
    this.mode.update((current) => (current === 'signin' ? 'signup' : 'signin'));
  }

  /** Données saisies par l'utilisateur, pilotées par le signal form. */
  protected readonly model = signal<RegisterPayload>({ email: '', password: '', nom: '', prenom: '' });

  /** Signal form : valeur + validation déclarative. Nom et prénom ne sont requis qu'à l'inscription. */
  protected readonly connectForm = form(this.model, (path) => {
    required(path.email, { message: "L'email est obligatoire" });
    email(path.email, { message: "Le format de l'adresse email est invalide" });
    required(path.password, { message: 'Le mot de passe est obligatoire' });
    minLength(path.password, PASSWORD_MIN_LENGTH, {
      message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
    });
    required(path.nom, { message: 'Le nom est obligatoire', when: () => this.mode() === 'signup' });
    required(path.prenom, { message: 'Le prénom est obligatoire', when: () => this.mode() === 'signup' });
  });

  /** Soumission : émet vers le parent, qui décide quoi faire (signin ou signup). */
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.connectForm().invalid()) {
      return;
    }
    if (this.mode() === 'signin') {
      this.signin.emit({ email: this.model().email, password: this.model().password });
    } else {
      this.signup.emit(this.model());
    }
  }
}

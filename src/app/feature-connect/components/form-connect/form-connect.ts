import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../shared/services/auth';
import { Router } from '@angular/router';

import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { Credentials } from '../../../shared/models/credentials';

@Component({
  selector: 'app-form-connect',
  imports: [FormField],
  templateUrl: './form-connect.html',
  styleUrl: './form-connect.css',
})
export class FormConnect {
  // inject router
  private readonly router = inject(Router)

  // inject Auth
  private readonly auth = inject(Auth);
  
  /** Données saisies par l'utilisateur, pilotées par le signal form. */
  private readonly model = signal<Credentials>({ email: '', password: '' });

  /** Signal form : valeur + validation déclarative. */
  protected readonly connectForm = form(this.model, (path) => {
    required(path.email, {message : "Le format de l'email est obligatoire"});
    email(path.email, {message: "Le format de l'adresse email est invalide"});
    required(path.password, {message : "Le format de l'email est obligatoire"});
    minLength(path.password, 6, {message : "Le mot de passe doit contenir au moins 6 caractères"})
  })

  /** Soumission : route vers signin ou signup selon le mode. */
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.connectForm().invalid()) {
      return;
    }
    const credentials = this.model();
    this.signin(credentials);
  }

  private signin(credentials: Credentials): void {
    // Connexion simulée : le service met à jour l'état et redirige.
    this.auth.signin(credentials);
  }
}

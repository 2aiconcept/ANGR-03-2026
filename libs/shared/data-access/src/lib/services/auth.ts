import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthSession, Credentials, RegisterPayload, User } from '@mini-crm/shared/util';
import { API_URL } from '../tokens/api-url.token';

const STORAGE_KEY = 'mini-crm.auth-session';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authUrl = `${inject(API_URL)}/auth`;
  // localStorage n'existe pas côté serveur (SSR) : on ne le touche que dans le navigateur.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // signal pour le currentUser
  readonly currentUser = signal<User | null>(null);

  // signal pour le token
  readonly token = signal<string | null>(null);

  // computed signal qui renveirra true ou false selon user authentifié ou non
  // isAuthentificated
  readonly isAuthenticated = computed(() => this.token() !== null);

  /** Message d'erreur renvoyé par l'API lors du dernier signin/signup, à afficher dans l'UI. */
  readonly error = signal<string | null>(null);

  readonly session = signal<AuthSession | null>(null);

  constructor() {
  if (!this.isBrowser) {
    return;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }
  const session: AuthSession = JSON.parse(stored);
  this.currentUser.set(session.user);
  this.token.set(session.token);
}


  signin(credentials: Credentials): void {
    this.error.set(null);
    this.http.post<AuthSession>(`${this.authUrl}/login`, credentials).subscribe({
      next: (session) => this.onAuthenticated(session),
      error: (response: HttpErrorResponse) =>
        this.error.set(response.error?.error ?? 'Connexion impossible'),
    });
  }

  signup(payload: RegisterPayload): void {
    console.log(payload);
    this.error.set(null);
    this.http.post<AuthSession>(`${this.authUrl}/register`, payload).subscribe({
      next: (session) => this.onAuthenticated(session),
      error: (response: HttpErrorResponse) =>
        this.error.set(response.error?.error ?? 'Inscription impossible'),
    });
  }

  logout(): void {
    this.save(null);
    this.router.navigate(['/connect']);
  }

  private onAuthenticated(session: AuthSession): void {
    this.save(session);
    this.router.navigate(['/companies']);
  }

  private readStoredSession(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  }

  private save(session: AuthSession | null): void {
    // console.log(session);
    this.session.set(session);
    if (!this.isBrowser) {
      return;
    }
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      this.currentUser.set(session.user);
      this.token.set(session.token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      this.currentUser.set(null);
      this.token.set(null);
    }
  }
}

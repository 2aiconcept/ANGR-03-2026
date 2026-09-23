import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';
import { authGuard } from './auth.guards';

describe('authGuard', () => {
  // Faux service Auth : on choisit si l'utilisateur est connecté ou non.
  const isAuthenticated = signal(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Auth, useValue: { isAuthenticated } }],
    });
  });

  /** Un guard utilise inject() : il doit tourner dans un contexte d'injection. */
  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  it('laisse passer un utilisateur connecté', () => {
    isAuthenticated.set(true);

    expect(runGuard()).toBe(true);
  });

  it('redirige un visiteur non connecté vers /connect', () => {
    isAuthenticated.set(false);

    const result = runGuard() as UrlTree;
    expect(result.toString()).toBe('/connect');
  });
});

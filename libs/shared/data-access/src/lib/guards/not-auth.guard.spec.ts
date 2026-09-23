import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';
import { notAuthGuard } from './not-auth.guard';

describe('notAuthGuard', () => {
  const isAuthenticated = signal(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Auth, useValue: { isAuthenticated } }],
    });
  });

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      notAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  it('laisse un visiteur non connecté accéder à la page de connexion', () => {
    isAuthenticated.set(false);

    expect(runGuard()).toBe(true);
  });

  it('renvoie un utilisateur déjà connecté vers /companies', () => {
    isAuthenticated.set(true);

    const result = runGuard() as UrlTree;
    expect(result.toString()).toBe('/companies');
  });
});

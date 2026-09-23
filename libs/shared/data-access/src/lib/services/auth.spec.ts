import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthSession } from '@mini-crm/shared/util';

import { Auth } from './auth';
import { API_URL } from '../tokens/api-url.token';

const STORAGE_KEY = 'mini-crm.auth-session';
const session: AuthSession = {
  token: 'jwt-123',
  user: { id: 2, email: 'user@test.com', nom: 'Stagiaire', prenom: 'Angular', role: 'user' },
};

describe('Auth', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_URL, useValue: 'https://api.test' },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('démarre déconnecté quand le localStorage est vide', () => {
    const auth = TestBed.inject(Auth);

    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.currentUser()).toBeNull();
  });

  it('relit la session du localStorage (l\'utilisateur reste connecté après un refresh)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    const auth = TestBed.inject(Auth);

    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.token()).toBe('jwt-123');
    expect(auth.currentUser()?.prenom).toBe('Angular');
  });

  it('signin() enregistre la session puis va vers /companies', () => {
    const auth = TestBed.inject(Auth);

    auth.signin({ email: 'user@test.com', password: 'password123' });
    const request = httpMock.expectOne('https://api.test/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush(session);

    expect(auth.token()).toBe('jwt-123');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(session);
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });

  it('signin() garde le message d\'erreur de l\'API si les identifiants sont faux', () => {
    const auth = TestBed.inject(Auth);

    auth.signin({ email: 'user@test.com', password: 'faux' });
    httpMock
      .expectOne('https://api.test/auth/login')
      .flush({ error: 'Email ou mot de passe incorrect' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.error()).toBe('Email ou mot de passe incorrect');
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('signup() envoie les données d\'inscription vers /auth/register', () => {
    const auth = TestBed.inject(Auth);

    auth.signup({ email: 'jean@test.com', password: 'password123', nom: 'Dupont', prenom: 'Jean' });
    const request = httpMock.expectOne('https://api.test/auth/register');
    expect(request.request.body.nom).toBe('Dupont');
    request.flush(session);

    expect(auth.isAuthenticated()).toBe(true);
  });

  it('logout() vide la session puis va vers /connect', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    const auth = TestBed.inject(Auth);

    auth.logout();

    expect(auth.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/connect']);
  });
});

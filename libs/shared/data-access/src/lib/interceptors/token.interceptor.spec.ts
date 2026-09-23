import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from '../services/auth';
import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  const token = signal<string | null>(null);
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // On branche uniquement l'intercepteur testé.
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: { token } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('ajoute l\'en-tête Authorization quand il y a un token', () => {
    token.set('jwt-123');

    http.get('/api/entreprises').subscribe();
    const request = httpMock.expectOne('/api/entreprises');

    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-123');
    request.flush([]);
  });

  it('n\'ajoute rien quand il n\'y a pas de token', () => {
    token.set(null);

    http.get('/api/entreprises').subscribe();
    const request = httpMock.expectOne('/api/entreprises');

    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  const auth = { logout: vi.fn() };
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    auth.logout.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Auth, useValue: auth },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpMock.verify());

  /** Fait une requête et répond avec le code HTTP donné. Renvoie l'erreur reçue par l'appelant. */
  function respondWith(status: number): unknown {
    let receivedError: unknown;
    http.get('/api/entreprises').subscribe({ error: (error) => (receivedError = error) });
    httpMock.expectOne('/api/entreprises').flush(null, { status, statusText: 'Error' });
    return receivedError;
  }

  it('401 (pas de token) : déconnecte l\'utilisateur', () => {
    respondWith(401);

    expect(auth.logout).toHaveBeenCalled();
  });

  it('403 (token invalide ou expiré, pour notre API) : déconnecte l\'utilisateur', () => {
    respondWith(403);

    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('404 : renvoie vers /not-found', () => {
    respondWith(404);

    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('500 : ne fait rien de spécial', () => {
    respondWith(500);

    expect(auth.logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('renvoie toujours l\'erreur au code qui a fait l\'appel', () => {
    expect(respondWith(500)).toBeTruthy();
  });
});

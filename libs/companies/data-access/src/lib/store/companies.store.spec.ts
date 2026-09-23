import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '@mini-crm/shared/data-access';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import { CompaniesStore } from './companies.store';

const API = 'https://api.test/entreprises';
const company: Company = { id: 1, nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };
const payload: CompanyPayload = { nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('CompaniesStore', () => {
  let store: InstanceType<typeof CompaniesStore>;
  // Simule l'API : on dit quelle réponse renvoyer à chaque requête.
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'https://api.test' },
      ],
    });
    store = TestBed.inject(CompaniesStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Vérifie qu'aucune requête inattendue n'est restée sans réponse.
  afterEach(() => httpMock.verify());

  it('démarre avec une liste vide, sans chargement ni erreur', () => {
    expect(store.entities()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('load() remplit la liste avec la réponse de l\'API', async () => {
    const done = store.load();
    httpMock.expectOne(API).flush([company]);
    await done;

    expect(store.entities()).toEqual([company]);
    expect(store.isLoading()).toBe(false);
  });

  it('load() met la clé d\'erreur si l\'API échoue', async () => {
    const done = store.load();
    httpMock.expectOne(API).flush(null, { status: 500, statusText: 'Server Error' });
    await done;

    expect(store.error()).toBe('companies.errors.load');
    expect(store.isLoading()).toBe(false);
  });

  it('loadOne() renvoie l\'entreprise demandée', async () => {
    const done = store.loadOne(1);
    httpMock.expectOne(`${API}/1`).flush(company);

    expect(await done).toEqual(company);
  });

  it('loadOne() renvoie null et met la clé d\'erreur si l\'API échoue', async () => {
    const done = store.loadOne(1);
    httpMock.expectOne(`${API}/1`).flush(null, { status: 404, statusText: 'Not Found' });

    expect(await done).toBeNull();
    expect(store.error()).toBe('companies.errors.loadOne');
  });

  it('add() envoie un POST et ajoute l\'entreprise créée à la liste', async () => {
    const done = store.add(payload);
    const request = httpMock.expectOne(API);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush(company);
    await done;

    expect(store.entities()).toEqual([company]);
    expect(store.isLoading()).toBe(false);
  });

  it('add() met la clé d\'erreur si l\'API échoue', async () => {
    const done = store.add(payload);
    httpMock.expectOne(API).flush(null, { status: 400, statusText: 'Bad Request' });
    await done;

    expect(store.error()).toBe('companies.errors.add');
    expect(store.entities()).toEqual([]);
  });

  it('update() envoie un PUT et met à jour l\'entreprise dans la liste', async () => {
    // On remplit d'abord la liste.
    const loaded = store.load();
    httpMock.expectOne(API).flush([company]);
    await loaded;

    const done = store.update(1, { ...payload, nom: 'Acme 2' });
    const request = httpMock.expectOne(`${API}/1`);
    expect(request.request.method).toBe('PUT');
    request.flush({ ...company, nom: 'Acme 2' });
    await done;

    expect(store.entities()[0].nom).toBe('Acme 2');
  });

  it('update() met la clé d\'erreur si l\'API échoue', async () => {
    const done = store.update(1, payload);
    httpMock.expectOne(`${API}/1`).flush(null, { status: 500, statusText: 'Server Error' });
    await done;

    expect(store.error()).toBe('companies.errors.update');
  });

  it('remove() envoie un DELETE et retire l\'entreprise de la liste', async () => {
    const loaded = store.load();
    httpMock.expectOne(API).flush([company]);
    await loaded;

    const done = store.remove(1);
    const request = httpMock.expectOne(`${API}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    await done;

    expect(store.entities()).toEqual([]);
  });

  it('remove() garde l\'entreprise et met la clé d\'erreur si l\'API échoue', async () => {
    const loaded = store.load();
    httpMock.expectOne(API).flush([company]);
    await loaded;

    const done = store.remove(1);
    httpMock.expectOne(`${API}/1`).flush(null, { status: 500, statusText: 'Server Error' });
    await done;

    expect(store.entities()).toEqual([company]);
    expect(store.error()).toBe('companies.errors.remove');
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '@mini-crm/shared/data-access';
import { Company, CompanyPayload } from '@mini-crm/companies/util';

import { CompanyService } from './company';

const API = 'https://api.test/entreprises';
const company: Company = { id: 1, nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'https://api.test' },
      ],
    });
    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('load() remplit le signal companies avec la réponse de l\'API', () => {
    service.load().subscribe();
    httpMock.expectOne(API).flush([company]);

    expect(service.companies()).toEqual([company]);
  });

  it('create() envoie un POST avec les données de l\'entreprise', () => {
    const payload: CompanyPayload = { nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };
    service.create(payload).subscribe();

    const request = httpMock.expectOne(API);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush(company);
  });

  it('remove() retire l\'entreprise de la liste', () => {
    service.load().subscribe();
    httpMock.expectOne(API).flush([company]);

    service.remove(1);
    httpMock.expectOne(`${API}/1`).flush(null);

    expect(service.companies()).toEqual([]);
  });

  it('remove() met la clé d\'erreur si l\'API échoue', () => {
    service.remove(1);
    httpMock.expectOne(`${API}/1`).flush(null, { status: 500, statusText: 'Server Error' });

    expect(service.error()).toBe('companies.errors.remove');
  });
});

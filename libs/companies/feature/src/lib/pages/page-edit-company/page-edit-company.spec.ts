import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { FormCompany } from '@mini-crm/companies/ui';
import { Company, CompanyPayload } from '@mini-crm/companies/util';

import PageEditCompany from './page-edit-company';

const company: Company = { id: 1, nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('PageEditCompany', () => {
  let fixture: ComponentFixture<PageEditCompany>;
  let element: HTMLElement;
  let router: Router;

  const store = {
    error: signal<string | null>(null),
    loadOne: vi.fn().mockResolvedValue(company),
    update: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    store.error.set(null);
    store.loadOne.mockClear();
    store.update.mockClear();

    await TestBed.configureTestingModule({
      imports: [PageEditCompany, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [provideRouter([]), { provide: CompaniesStore, useValue: store }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(PageEditCompany);
    // En vrai, c'est withComponentInputBinding qui donne l'id de l'URL : ici on le donne à la main.
    fixture.componentRef.setInput('id', '1');
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('charge l\'entreprise dont l\'id est dans l\'URL', () => {
    expect(store.loadOne).toHaveBeenCalledWith(1);
  });

  it('pré-remplit le formulaire avec l\'entreprise chargée', () => {
    expect(element.querySelector<HTMLInputElement>('#nom')!.value).toBe('Acme');
  });

  it('enregistre les modifications puis revient à la liste', async () => {
    const changes: CompanyPayload = { nom: 'Acme 2', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };
    const form: FormCompany = fixture.debugElement.query(By.directive(FormCompany)).componentInstance;

    form.save.emit(changes);
    await fixture.whenStable();

    expect(store.update).toHaveBeenCalledWith(1, changes);
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });
});

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { Company } from '@mini-crm/companies/util';

import PageListCompanies from './page-list-companies';

const company: Company = { id: 1, nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('PageListCompanies', () => {
  let fixture: ComponentFixture<PageListCompanies>;
  let element: HTMLElement;
  let router: Router;

  // Faux store : juste ce que la page utilise.
  const store = {
    entities: signal<Company[]>([company]),
    error: signal<string | null>(null),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    // jsdom ne sait pas ouvrir un <dialog> : on remplace ces méthodes par des fonctions vides.
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    store.error.set(null);
    store.remove.mockClear();

    await TestBed.configureTestingModule({
      imports: [PageListCompanies, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [provideRouter([]), { provide: CompaniesStore, useValue: store }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(PageListCompanies);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('affiche les entreprises du store', () => {
    expect(element.querySelector('tbody')!.textContent).toContain('Acme');
  });

  it('affiche l\'erreur du store (sa clé de traduction)', async () => {
    store.error.set('companies.errors.load');
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')!.textContent).toContain('companies.errors.load');
  });

  it('va vers la page d\'ajout', () => {
    element.querySelector<HTMLButtonElement>('.btn-primary')!.click();

    expect(router.navigate).toHaveBeenCalledWith(['/companies/add']);
  });

  it('va vers la page d\'édition de l\'entreprise cliquée', () => {
    element.querySelector<HTMLButtonElement>('.btn-outline-primary')!.click();

    expect(router.navigate).toHaveBeenCalledWith(['/companies/edit', 1]);
  });

  it('supprime l\'entreprise après confirmation', async () => {
    element.querySelector<HTMLButtonElement>('.btn-outline-danger')!.click();
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('dialog .btn-danger')!.click();

    expect(store.remove).toHaveBeenCalledWith(1);
  });

  it('ne supprime rien si on annule', async () => {
    element.querySelector<HTMLButtonElement>('.btn-outline-danger')!.click();
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('dialog .btn-secondary')!.click();

    expect(store.remove).not.toHaveBeenCalled();
  });
});

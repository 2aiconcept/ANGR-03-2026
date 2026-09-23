import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { FormCompany } from '@mini-crm/companies/ui';
import { CompanyPayload } from '@mini-crm/companies/util';

import PageAddCompany from './page-add-company';

const payload: CompanyPayload = { nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('PageAddCompany', () => {
  let fixture: ComponentFixture<PageAddCompany>;
  let router: Router;

  const store = {
    error: signal<string | null>(null),
    add: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    store.error.set(null);
    store.add.mockClear();

    await TestBed.configureTestingModule({
      imports: [PageAddCompany, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [provideRouter([]), { provide: CompaniesStore, useValue: store }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(PageAddCompany);
    await fixture.whenStable();
  });

  /** Simule l'envoi du formulaire enfant : il émet son output save. */
  async function saveForm(): Promise<void> {
    const form: FormCompany = fixture.debugElement.query(By.directive(FormCompany)).componentInstance;
    form.save.emit(payload);
    await fixture.whenStable();
  }

  it('crée l\'entreprise puis revient à la liste', async () => {
    await saveForm();

    expect(store.add).toHaveBeenCalledWith(payload);
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });

  it('reste sur la page si le store a une erreur', async () => {
    store.error.set('companies.errors.add');
    await saveForm();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});

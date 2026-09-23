import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CompaniesStore } from '../store/companies.store';
import { companiesResolver } from './companies.resolver';

describe('companiesResolver', () => {
  it('demande au store de charger les entreprises', async () => {
    // Faux store : on vérifie seulement que load() est appelé.
    const store = { load: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      providers: [{ provide: CompaniesStore, useValue: store }],
    });

    // Un resolver utilise inject() : il doit tourner dans un contexte d'injection.
    await TestBed.runInInjectionContext(() =>
      companiesResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(store.load).toHaveBeenCalled();
  });
});

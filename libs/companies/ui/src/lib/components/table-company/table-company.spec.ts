import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Company } from '@mini-crm/companies/util';

import { TableCompany } from './table-company';

const companies: Company[] = [
  { id: 1, nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' },
  { id: 2, nom: 'Globex', secteur: 'Énergie', adresse: 'Lyon', telephone: '0607080910' },
];

describe('TableCompany', () => {
  let component: TableCompany;
  let fixture: ComponentFixture<TableCompany>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Sans traductions chargées, le pipe transloco affiche la clé : pratique pour les tests.
      imports: [TableCompany, TranslocoTestingModule.forRoot({ langs: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCompany);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', async () => {
    fixture.componentRef.setInput('companies', []);
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('affiche une ligne par entreprise', async () => {
    fixture.componentRef.setInput('companies', companies);
    await fixture.whenStable();

    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Acme');
    expect(rows[1].textContent).toContain('Globex');
  });

  it('affiche un message quand la liste est vide', async () => {
    fixture.componentRef.setInput('companies', []);
    await fixture.whenStable();

    expect(element.querySelector('tbody')!.textContent).toContain('companies.table.empty');
  });

  it('émet l\'id quand on clique sur Éditer', async () => {
    fixture.componentRef.setInput('companies', companies);
    await fixture.whenStable();
    const editSpy = vi.fn();
    component.editCompany.subscribe(editSpy);

    element.querySelectorAll<HTMLButtonElement>('.btn-outline-primary')[1].click();

    expect(editSpy).toHaveBeenCalledWith(2);
  });

  it('émet l\'id et le nom quand on clique sur Supprimer', async () => {
    fixture.componentRef.setInput('companies', companies);
    await fixture.whenStable();
    const deleteSpy = vi.fn();
    component.deleteCompany.subscribe(deleteSpy);

    element.querySelector<HTMLButtonElement>('.btn-outline-danger')!.click();

    expect(deleteSpy).toHaveBeenCalledWith({ id: 1, company: 'Acme' });
  });
});

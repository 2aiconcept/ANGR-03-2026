import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { CompanyPayload } from '@mini-crm/companies/util';

import { FormCompany } from './form-company';

const payload: CompanyPayload = { nom: 'Acme', secteur: 'Tech', adresse: 'Paris', telephone: '0102030405' };

describe('FormCompany', () => {
  let component: FormCompany;
  let fixture: ComponentFixture<FormCompany>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompany, TranslocoTestingModule.forRoot({ langs: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCompany);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  /** Tape une valeur dans un champ, comme le ferait l'utilisateur. */
  function type(id: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit(): void {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
  }

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('pré-remplit les champs avec initialValue (cas de l\'édition)', async () => {
    fixture.componentRef.setInput('initialValue', payload);
    await fixture.whenStable();

    expect(element.querySelector<HTMLInputElement>('#nom')!.value).toBe('Acme');
    expect(element.querySelector<HTMLInputElement>('#telephone')!.value).toBe('0102030405');
  });

  it('n\'émet rien si le formulaire est invalide', async () => {
    await fixture.whenStable();
    const saveSpy = vi.fn();
    component.save.subscribe(saveSpy);

    submit();

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('émet les données saisies quand le formulaire est valide', async () => {
    await fixture.whenStable();
    const saveSpy = vi.fn();
    component.save.subscribe(saveSpy);

    type('nom', 'Acme');
    type('secteur', 'Tech');
    type('adresse', 'Paris');
    type('telephone', '0102030405');
    submit();

    expect(saveSpy).toHaveBeenCalledWith(payload);
  });

  it('désactive le bouton tant que le formulaire est invalide', async () => {
    await fixture.whenStable();
    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(button.disabled).toBe(true);
  });

  it('affiche la clé de traduction du libellé du bouton', async () => {
    fixture.componentRef.setInput('submitLabel', 'companies.add.submit');
    await fixture.whenStable();

    expect(element.querySelector('button[type="submit"]')!.textContent).toContain('companies.add.submit');
  });
});

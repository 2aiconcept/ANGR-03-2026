import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  let element: HTMLElement;

  beforeEach(async () => {
    // jsdom ne sait pas ouvrir un <dialog> : on remplace ces méthodes par des espions.
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ConfirmDialog, TranslocoTestingModule.forRoot({ langs: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('ne s\'ouvre pas quand open vaut false', async () => {
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it('s\'ouvre en modale quand open vaut true', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('affiche le titre et le message reçus', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'companies.delete.title');
    fixture.componentRef.setInput('message', 'Supprimer Acme ?');
    await fixture.whenStable();

    expect(element.querySelector('h2')!.textContent).toContain('companies.delete.title');
    expect(element.querySelector('p')!.textContent).toContain('Supprimer Acme ?');
  });

  it('émet confirmed quand on clique sur Confirmer', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    const confirmedSpy = vi.fn();
    component.confirmed.subscribe(confirmedSpy);

    element.querySelector<HTMLButtonElement>('.btn-danger')!.click();

    expect(confirmedSpy).toHaveBeenCalled();
  });

  it('émet cancelled quand on clique sur Annuler', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    const cancelledSpy = vi.fn();
    component.cancelled.subscribe(cancelledSpy);

    element.querySelector<HTMLButtonElement>('.btn-secondary')!.click();

    expect(cancelledSpy).toHaveBeenCalled();
  });
});

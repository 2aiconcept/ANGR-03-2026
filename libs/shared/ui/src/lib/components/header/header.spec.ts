import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { User } from '@mini-crm/shared/util';

import { Header } from './header';

const user: User = { id: 2, email: 'user@test.com', nom: 'Dupont', prenom: 'Jean', role: 'user' };

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Header,
        // Les deux langues doivent exister pour pouvoir passer de l'une à l'autre.
        TranslocoTestingModule.forRoot({
          langs: { fr: {}, en: {} },
          translocoConfig: { availableLangs: ['fr', 'en'], defaultLang: 'fr' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('n\'affiche ni nom ni déconnexion si personne n\'est connecté', () => {
    expect(element.textContent).not.toContain('Jean');
    expect(element.textContent).not.toContain('header.logout');
  });

  it('affiche le prénom et le nom de l\'utilisateur connecté', async () => {
    fixture.componentRef.setInput('user', user);
    await fixture.whenStable();

    expect(element.textContent).toContain('Jean Dupont');
  });

  it('émet logout quand on clique sur Déconnexion', async () => {
    fixture.componentRef.setInput('user', user);
    await fixture.whenStable();
    const logoutSpy = vi.fn();
    component.logout.subscribe(logoutSpy);

    element.querySelector<HTMLButtonElement>('.btn-outline-light:not(.btn-sm)')!.click();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('passe l\'application en anglais quand on clique sur EN', async () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('.btn-sm');
    buttons[1].click();
    await fixture.whenStable();

    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
});

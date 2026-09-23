import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';

import { Nav } from './nav';

describe('Nav', () => {
  let fixture: ComponentFixture<Nav>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav, TranslocoTestingModule.forRoot({ langs: {} })],
      // routerLink a besoin du routeur.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('affiche un lien vers chaque feature', () => {
    const links = Array.from(element.querySelectorAll('a')).map((link) => link.getAttribute('href'));

    expect(links).toEqual(['/companies', '/contacts', '/orders']);
  });

  it('affiche les libellés traduits (ici leurs clés)', () => {
    expect(element.textContent).toContain('nav.companies');
    expect(element.textContent).toContain('nav.contacts');
    expect(element.textContent).toContain('nav.orders');
  });
});

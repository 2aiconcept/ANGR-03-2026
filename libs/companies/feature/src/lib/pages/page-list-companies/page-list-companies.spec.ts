import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from '@mini-crm/shared/data-access';

import PageListCompanies from './page-list-companies';

describe('PageListCompanies', () => {
  let component: PageListCompanies;
  let fixture: ComponentFixture<PageListCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListCompanies],
      providers: [{ provide: API_URL, useValue: 'https://api.test' }],
    }).compileComponents();

    fixture = TestBed.createComponent(PageListCompanies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

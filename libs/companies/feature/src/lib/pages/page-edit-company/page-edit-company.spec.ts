import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '@mini-crm/shared/data-access';

import PageEditCompany from './page-edit-company';

describe('PageEditCompany', () => {
  let component: PageEditCompany;
  let fixture: ComponentFixture<PageEditCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditCompany],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'https://api.test' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditCompany);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

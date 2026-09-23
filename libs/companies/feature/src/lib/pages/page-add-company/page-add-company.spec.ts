import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { API_URL } from '@mini-crm/shared/data-access';

import PageAddCompany from './page-add-company';

describe('PageAddCompany', () => {
  let component: PageAddCompany;
  let fixture: ComponentFixture<PageAddCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddCompany, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [{ provide: API_URL, useValue: 'https://api.test' }],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

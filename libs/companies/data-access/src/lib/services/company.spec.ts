import { TestBed } from '@angular/core/testing';
import { API_URL } from '@mini-crm/shared/data-access';

import { CompanyService } from './company';

describe('Company', () => {
  let service: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: API_URL, useValue: 'https://api.test' }],
    });
    service = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

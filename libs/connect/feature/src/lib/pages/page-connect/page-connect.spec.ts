import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '@mini-crm/shared/data-access';

import { PageConnect } from './page-connect';

describe('PageConnect', () => {
  let component: PageConnect;
  let fixture: ComponentFixture<PageConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageConnect],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_URL, useValue: 'https://api.test' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageConnect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditCompany } from './page-edit-company';

describe('PageEditCompany', () => {
  let component: PageEditCompany;
  let fixture: ComponentFixture<PageEditCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

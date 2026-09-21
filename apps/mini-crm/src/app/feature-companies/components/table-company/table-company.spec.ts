import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCompany } from './table-company';

describe('TableCompany', () => {
  let component: TableCompany;
  let fixture: ComponentFixture<TableCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

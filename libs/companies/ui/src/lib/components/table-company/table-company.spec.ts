import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { TableCompany } from './table-company';

describe('TableCompany', () => {
  let component: TableCompany;
  let fixture: ComponentFixture<TableCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCompany, TranslocoTestingModule.forRoot({ langs: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCompany);
    fixture.componentRef.setInput('companies', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

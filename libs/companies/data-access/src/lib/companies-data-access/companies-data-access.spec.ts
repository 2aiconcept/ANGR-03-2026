import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesDataAccess } from './companies-data-access';

describe('CompaniesDataAccess', () => {
  let component: CompaniesDataAccess;
  let fixture: ComponentFixture<CompaniesDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

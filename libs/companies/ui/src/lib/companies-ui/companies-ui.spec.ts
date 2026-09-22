import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesUi } from './companies-ui';

describe('CompaniesUi', () => {
  let component: CompaniesUi;
  let fixture: ComponentFixture<CompaniesUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesUi],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

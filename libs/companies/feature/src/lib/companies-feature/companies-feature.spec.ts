import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesFeature } from './companies-feature';

describe('CompaniesFeature', () => {
  let component: CompaniesFeature;
  let fixture: ComponentFixture<CompaniesFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

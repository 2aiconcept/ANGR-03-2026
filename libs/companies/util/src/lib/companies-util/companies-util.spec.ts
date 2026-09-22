import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesUtil } from './companies-util';

describe('CompaniesUtil', () => {
  let component: CompaniesUtil;
  let fixture: ComponentFixture<CompaniesUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesUtil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

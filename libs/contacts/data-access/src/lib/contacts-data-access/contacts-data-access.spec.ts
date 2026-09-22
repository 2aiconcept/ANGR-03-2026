import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsDataAccess } from './contacts-data-access';

describe('ContactsDataAccess', () => {
  let component: ContactsDataAccess;
  let fixture: ComponentFixture<ContactsDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsUtil } from './contacts-util';

describe('ContactsUtil', () => {
  let component: ContactsUtil;
  let fixture: ComponentFixture<ContactsUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsUtil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

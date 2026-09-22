import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsFeature } from './contacts-feature';

describe('ContactsFeature', () => {
  let component: ContactsFeature;
  let fixture: ComponentFixture<ContactsFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

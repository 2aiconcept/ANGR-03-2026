import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundFeature } from './not-found-feature';

describe('NotFoundFeature', () => {
  let component: NotFoundFeature;
  let fixture: ComponentFixture<NotFoundFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

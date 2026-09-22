import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectFeature } from './connect-feature';

describe('ConnectFeature', () => {
  let component: ConnectFeature;
  let fixture: ComponentFixture<ConnectFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

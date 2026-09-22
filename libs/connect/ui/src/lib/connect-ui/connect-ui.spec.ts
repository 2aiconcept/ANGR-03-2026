import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectUi } from './connect-ui';

describe('ConnectUi', () => {
  let component: ConnectUi;
  let fixture: ComponentFixture<ConnectUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

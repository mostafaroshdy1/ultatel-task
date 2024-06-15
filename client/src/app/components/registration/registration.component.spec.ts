import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegisterationComponent;
  let fixture: ComponentFixture<RegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

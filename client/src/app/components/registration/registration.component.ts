import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registerForm: FormGroup;
  showPassword = false;
  emailToken = '';
  emailResent = false;
  register = true;
  emailConfirmation = false;
  emailTaken = false;
  showConfirmPassword = false;
  passwordStrength = {
    class: '',
    lengthValid: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSymbol: false,
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markAllAsTouched(control as FormGroup);
      }
    });
  }

  checkPasswordStrength(): void {
    const password = this.registerForm.get('password')?.value;
    this.passwordStrength.lengthValid = password.length >= 8;
    this.passwordStrength.hasNumber = /[0-9]/.test(password);
    this.passwordStrength.hasUpperCase = /[A-Z]/.test(password);
    this.passwordStrength.hasLowerCase = /[a-z]/.test(password);
    this.passwordStrength.hasSymbol = /[^A-Za-z0-9]/.test(password);

    const validations = this.countValidations();
    if (this.passwordStrength.lengthValid && validations === 4) {
      this.passwordStrength.class = 'strong';
    } else if (this.passwordStrength.lengthValid && validations >= 2) {
      this.passwordStrength.class = 'medium';
    } else if (this.passwordStrength.lengthValid) {
      this.passwordStrength.class = 'weak';
    } else {
      this.passwordStrength.class = 'very-weak';
    }
  }

  countValidations(): number {
    let count = 0;
    if (this.passwordStrength.hasNumber) count++;
    if (this.passwordStrength.hasUpperCase) count++;
    if (this.passwordStrength.hasLowerCase) count++;
    if (this.passwordStrength.hasSymbol) count++;
    return count;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      this.authService.register(user).subscribe(
        (response) => {
          if (response.email) {
            this.register = false;
            this.emailConfirmation = true;
            this.emailToken = response.emailToken;
          }
        },
        (error) => {
          if (error.error.message === 'Email already exists') {
            this.emailTaken = true;
          } else {
            this.emailTaken = false;
          }
        }
      );
    } else {
      this.markAllAsTouched(this.registerForm);
    }
  }

  resendConfirmationEmail(): void {
    const email = this.registerForm.get('email')?.value;

    if (email) {
      this.authService
        .resendConfirmationEmail(email)
        .pipe(
          throttleTime(4000),
          tap(() => {
            this.emailResent = true;
          }),
          catchError((error) => {
            console.error('Error resending confirmation email:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }
}

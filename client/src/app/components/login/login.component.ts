import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of, throttleTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  passwordErrorMessage = '';
  showAnchorTag = false;
  emailErrorMessage = '';
  loginForm: FormGroup;
  showPassword = false;
  user: any;
  resendConfirmation = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  onSubmit(): void {
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.showAnchorTag = false;

    if (this.loginForm.valid) {
      this.user = this.loginForm.value;

      this.authService.login(this.user).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.error('Login error:', error);

          if (error.error.statusCode === 403) {
            this.emailErrorMessage = 'Email is not confirmed ';
            this.resendConfirmation = true;
          } else if (error.error.statusCode === 404) {
            this.emailErrorMessage = `Email doesn't exist`;
            this.showAnchorTag = true;
          } else if (error.error.statusCode === 401) {
            this.passwordErrorMessage = 'Wrong Password';
          }
        },
      });
    } else {
      this.markAllAsTouched(this.loginForm);
    }
  }

  resendConfirmationEmail(): void {
    this.authService
      .resendConfirmationEmail(this.user.email)
      .pipe(
        throttleTime(4000),

        catchError((error) => {
          console.error('Error resending confirmation email:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}

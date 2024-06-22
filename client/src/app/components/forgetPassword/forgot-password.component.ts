import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AuthService, AlertService],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertService: AlertService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm.value.email);
      this.authService
        .forgetPassword(this.forgotPasswordForm.value.email)
        .subscribe({
          next: () => {
            this.alertService
              .success(
                'Please check your email for further instructions.',
                "'Password Reset Link Sent!'"
              )
              .then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/login']);
                }
              });
          },
          error: (err: any) => {
            let errorMessage = 'Something went wrong.';
            if (err.error.statusCode === 404) {
              errorMessage = 'Email not found.';
            } else if (err.error.statusCode === 400) {
              errorMessage = 'invalid Email';
            }

            this.alertService.error(errorMessage);
          },
        });
    } else {
      this.alertService.error('Please enter a valid email address.');
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AuthService],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private readonly router: Router,
    private readonly authService: AuthService
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
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Password Reset Link Sent!',
              text: 'Please check your email for further instructions.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            }).then((result) => {
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

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: errorMessage,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            });
          },
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  }
}

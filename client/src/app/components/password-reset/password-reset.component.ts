import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AlertService],
})
export class PasswordResetFormComponent implements OnInit {
  passwordResetForm: FormGroup;
  showPassword: boolean = false;
  passwordInvalid: boolean = false;
  confirmPasswordInvalid: boolean = false;
  passwordType = 'password';
  userId: string = '';
  token: string = '';
  passwordStrength = {
    class: '',
    lengthValid: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSymbol: false,
  };
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {
    this.passwordResetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.token = params['token'];
    });
  }
  countValidations(): number {
    let count = 0;
    if (this.passwordStrength.hasNumber) count++;
    if (this.passwordStrength.hasUpperCase) count++;
    if (this.passwordStrength.hasLowerCase) count++;
    if (this.passwordStrength.hasSymbol) count++;
    return count;
  }
  checkPasswordStrength(): void {
    const password = this.passwordResetForm.get('password')?.value;
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

  onSubmit(): void {
    if (this.passwordResetForm.valid && !this.confirmPasswordInvalid) {
      const { password } = this.passwordResetForm.value;
      this.authService
        .resetPassword(password, this.token, this.userId)
        .subscribe({
          next: () => {
            this.alertService
              .success(
                'Your password has been reset successfully.',
                'Password Reset Successful!'
              )
              .then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/login']);
                }
              });
          },
          error: (error) => {
            let errorMessage =
              'Failed to reset your password. Please try again later.';
            if (error.error.statusCode === 401) {
              errorMessage = 'Expired token. Please try again.';
            }
            this.alertService.error(errorMessage, 'Password Reset Failed!');
          },
        });
    } else {
      this.confirmPasswordInvalid =
        this.passwordResetForm.value.password !==
        this.passwordResetForm.value.confirmPassword;
      this.passwordInvalid = !this.passwordResetForm.controls['password'].valid;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
  }
}

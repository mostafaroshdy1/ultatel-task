import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgetPassword/forgot-password.component';
import { StudentComponent } from './components/student/student.component';
import { AuthGuard } from '../guards/auth.guard';
import { DeactivateGuard } from '../guards/deactivate.guard';
import { PasswordResetFormComponent } from './components/password-reset/password-reset.component';
export const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [DeactivateGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [DeactivateGuard],
  },
  {
    path: 'verify-email/:id/:token',
    component: EmailConfirmedComponent,
    canActivate: [DeactivateGuard],
  },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },
  {
    path: 'resetpassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'resetpassword/:userId/:token',
    component: PasswordResetFormComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

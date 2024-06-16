import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { StudentComponent } from './components/student/student.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'verify-email/:id/:token',
    component: EmailConfirmedComponent,
  },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

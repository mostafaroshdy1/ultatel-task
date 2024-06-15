import { Routes } from '@angular/router';
import { RegisterationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
export const routes: Routes = [
  { path: 'register', component: RegisterationComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

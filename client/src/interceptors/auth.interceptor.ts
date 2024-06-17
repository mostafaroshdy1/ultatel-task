import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  const authService = inject(AuthService);
  if (localStorage.getItem('token') !== null)
    token = localStorage.getItem('token');

  // Define URLs to exclude from interception
  const excludedUrls = ['/auth', '/login', '/register', '/reactivate'];
  if (excludedUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const modifiedReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  // console.log('Request intercepted:', req.url);

  // Continue with the modified request
  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        Swal.fire({
          title: 'Hold on!',
          text: 'Session is expired. Do you want to refresh the session?',
          icon: 'question',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            authService.refreshToken();
          } else {
            authService.logout();
          }
        });
      }
      return throwError(error);
    })
  );
};

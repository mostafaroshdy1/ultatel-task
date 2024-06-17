import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

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

  console.log('Request intercepted:', req.url);

  // Continue with the modified request
  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const isRefresh = confirm(
          'Your session has expired. Do you want to refresh it?'
        );
        if (isRefresh) {
          authService.refreshToken();
        }
      }
      return throwError(error);
    })
  );
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

import { AlertService } from './alert.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  public $refreshToken = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly alertService: AlertService
  ) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user`, user);
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/reactivate/${email}`);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, user);
  }

  confirmEmail(token: string, userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/activate/${userId}/${token}`);
  }
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.http
      .post(`${this.baseUrl}/auth/refresh-token`, {
        refreshToken: refreshToken,
      })
      .subscribe(
        (res: any) => {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refreshToken', res.refresh_token);
          window.location.reload();
        },
        (error) => {
          this.alertService
            .error('Too late , please login again!')
            .then((result) => {
              if (result.isConfirmed) {
                this.logout();
              }
            });
        }
      );
  }
  forgetPassword(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/resetpassword/${email}`);
  }

  resetPassword(
    password: string,
    token: string,
    userId: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/changepassword/`, {
      userId,
      password,
      token,
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  public $refreshToken = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    // this.$refreshToken.subscribe((res: any) => {
    //   this.refreshToken();
    // });
  }

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

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.http
      .post(`${this.baseUrl}/auth/refresh-token`, {
        refreshToken: refreshToken,
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refreshToken', res.refresh_token);
        },
        (error) => {
          console.log('asfasf');

          localStorage.clear();
          this.router.navigate(['/login']);
          // alert('Your session has expired. Please log in again.');
        }
      );
  }
}

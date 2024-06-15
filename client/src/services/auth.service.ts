import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    console.log(user);
    console.log(this.baseUrl);

    return this.http.post(`${this.baseUrl}/user`, user);
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-confirmation-email`, {
      email,
    });
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/confirm-email`, {
      params: { token },
    });
  }
}

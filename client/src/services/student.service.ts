import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStudents(filters: any): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    // Add query parameters
    if (filters.name) {
      params = params.append('name', filters.name);
    }
    if (filters.minAge) {
      params = params.append('minAge', filters.minAge);
    }
    if (filters.maxAge) {
      params = params.append('maxAge', filters.maxAge);
    }
    if (filters.country) {
      params = params.append('country', filters.country);
    }
    if (filters.gender) {
      params = params.append('gender', filters.gender);
    }
    if (filters.limit) {
      params = params.append('limit', filters.limit);
    }
    if (filters.offset) {
      params = params.append('offset', filters.offset);
    }
    if (filters.orderBy) {
      params = params.append('orderBy', filters.orderBy);
    }
    if (filters.order) {
      params = params.append('order', filters.order);
    }

    return this.http.get<any[]>(`${this.baseUrl}/student`, { headers, params });
  }

  getStudentById(studentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/${studentId}`, { headers });
  }

  createStudent(studentData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/student`, studentData, {
      headers,
    });
  }

  updateStudent(studentId: number, studentData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<any>(
      `${this.baseUrl}/student/${studentId}`,
      studentData,
      {
        headers,
      }
    );
  }

  deleteStudent(studentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/student/${studentId}`, {
      headers,
    });
  }
}

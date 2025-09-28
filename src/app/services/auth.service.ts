import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Login user
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => {
        if (!this.isBrowser()) return; // skip if not browser

        if (res.data?.id) {
          localStorage.setItem('userId', res.data.id);
        }
        if (res.data?.token) {
          localStorage.setItem('auth_token', res.data.token);
        }
        if (res.data?.roles) {
          localStorage.setItem('user_roles', JSON.stringify(res.data.roles));
        }
        if (res.data?.username) {
          localStorage.setItem('username', res.data.username);
        }
      })
    );
  }

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('auth_token');
  }

  // Logout user
  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  // Get stored token
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('auth_token');
  }

  // Get user id
  getUserId(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('userId');
  }

  // Get user roles
  getRoles(): string[] {
    if (!this.isBrowser()) return [];
    const roles = localStorage.getItem('user_roles');
    return roles ? JSON.parse(roles) : [];
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    if (!this.isBrowser()) return false;
    return this.getRoles().includes(role);
  }

  // Helper to add token to headers for protected API calls
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken() ?? ''}`
    });
  }
}

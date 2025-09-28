// src/app/services/account.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private baseUrl = 'http://localhost:8080/accounts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Create a new account (Admin)
  createAccount(customerId: number, accountType: string): Observable<any> {
    const url = `${this.baseUrl}/create/${customerId}?accountType=${accountType}`;
    return this.http.post(url, {}, { headers: this.authService.getAuthHeaders() });
  }

  // Get account balance (Admin & Customer)
  getBalance(accountNumber: string): Observable<any> {
    const url = `${this.baseUrl}/balance/${accountNumber}`;
    return this.http.get(url, { headers: this.authService.getAuthHeaders() });
  }
}

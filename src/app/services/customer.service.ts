// src/app/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Customer {
  id: number;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/customers'; // your Spring Boot API

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all customers
  getCustomers(): Observable<{ status: number, message: string, data: Customer[] }> {
    return this.http.get<{ status: number, message: string, data: Customer[] }>(
      `${this.baseUrl}/all`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}

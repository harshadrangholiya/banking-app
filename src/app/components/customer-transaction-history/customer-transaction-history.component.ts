import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-customer-transaction-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableModule, CardModule, ToastModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './customer-transaction-history.component.html',
  providers: [MessageService]
})
export class CustomerTransactionHistoryComponent implements OnInit {
  accounts: any[] = [];
  selectedAccount?: any;
  transactions: any[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('userId');
    if (customerId) {
      this.fetchAccounts(customerId);
    }
  }

  fetchAccounts(customerId: string) {
    this.loading = true;
    this.customerService.getAccountsByCustomerId(customerId).subscribe({
      next: (res) => this.accounts = res.data || res,
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load accounts' });
      },
      complete: () => this.loading = false
    });
  }

  fetchTransactions() {
    if (!this.selectedAccount) {
      this.transactions = [];
      return;
    }
  
    this.loading = true;
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    interface ApiResponse<T> {
      status: number;
      message: string;
      data: T;
    }
  
    this.http.get<ApiResponse<any[]>>(
      `http://localhost:8080/transactions/history/${this.selectedAccount.accountNumber}`,
      { headers }
    ).subscribe({
      next: (res) => this.transactions = res.data || [],
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch transactions' });
      },
      complete: () => this.loading = false
    });
  }
  
}

import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-customer-balance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableModule, CardModule, ProgressSpinnerModule],
  templateUrl: './customer-balance.component.html'
})
export class CustomerBalanceComponent implements OnInit {
  accounts: any;
  loading = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.fetchAccounts();
  }

  fetchAccounts() {
    const customerId = localStorage.getItem('userId');
    this.customerService.getAccountsByCustomerId(customerId).subscribe({
      next: (res) => {
        this.accounts = res.data;
      },
      error: (err) => {
        console.error('Failed to load customers', err);
      }
    });
  }
}

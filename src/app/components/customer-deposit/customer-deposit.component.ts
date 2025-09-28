import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-customer-deposit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    ToastModule
  ],
  templateUrl: './customer-deposit.component.html',
  providers: [MessageService]
})
export class CustomerDepositComponent implements OnInit {
  depositForm!: FormGroup;
  accounts: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.depositForm = this.fb.group({
      accountNumber: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

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

  deposit() {
    if (this.depositForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Select account and enter a valid amount' });
      return;
    }

    const { accountNumber, amount, description } = this.depositForm.value;

    this.loading = true;
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const body = { accountNumber, amount, description };

    this.http.post('http://localhost:8080/transactions/deposit', body, { headers }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deposit successful' });
        this.depositForm.reset({ amount: 0, description: '' });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Deposit failed' });
      },
      complete: () => this.loading = false
    });
  }
}

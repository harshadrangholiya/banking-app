import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-withdraw',
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
  providers: [MessageService],
  templateUrl: './customer-withdraw.component.html',
})
export class CustomerWithdrawComponent implements OnInit {

  withdrawForm!: FormGroup;
  accounts: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const customerId = localStorage.getItem('userId');
    if (customerId) {
      this.fetchAccounts(customerId);
    }
  }

  initForm() {
    this.withdrawForm = this.fb.group({
      accountNumber: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  fetchAccounts(customerId: any) {
    this.loading = true;
    this.customerService.getAccountsByCustomerId(customerId).subscribe({
      next: (res: any) => this.accounts = res.data || [],
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load accounts' });
      },
      complete: () => this.loading = false
    });
  }

  withdraw() {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Select account and enter a valid amount' });
      return;
    }

    const { accountNumber, amount, description } = this.withdrawForm.value;

    this.loading = true;
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const body = { accountNumber, amount, description };

    this.http.post('http://localhost:8080/transactions/withdraw', body, { headers }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Withdrawal successful' });
        this.withdrawForm.reset({ amount: 0, description: '' });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Withdrawal failed' });
      },
      complete: () => this.loading = false
    });
  }
}

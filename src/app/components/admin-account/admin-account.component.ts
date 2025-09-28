import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    MessageModule,
  ],
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent implements OnInit {
  accountForm!: FormGroup;
  customers: any[] = []; // load from service
  accountTypes = [
    { label: 'SAVINGS', value: 'SAVINGS' },
    { label: 'CURRENT', value: 'CURRENT' }
  ];
  message = '';
  messageSeverity: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private accountService: AccountService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      customerId: [null, Validators.required],
      accountType: [null, Validators.required]
    });

    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res.data;
      },
      error: (err) => {
        console.error('Failed to load customers', err);
      }
    });
  }

  createAccount() {
    if (this.accountForm.invalid) {
      this.message = 'Please fill all required fields.';
      this.messageSeverity = 'error';
      this.clearMessageAfterDelay();
      return;
    }

    const { customerId, accountType } = this.accountForm.value;
    this.accountService.createAccount(customerId, accountType).subscribe({
      next: (res) => {
        this.message = res.message || 'Account created successfully!';
        this.messageSeverity = 'success';
        this.accountForm.reset();
        this.clearMessageAfterDelay();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to create account.';
        this.messageSeverity = 'error';
        this.clearMessageAfterDelay();
      }
    });
  }

  /**
 * Helper method to remove message after 5 seconds
 */
private clearMessageAfterDelay() {
  setTimeout(() => {
    this.message = '';
  }, 5000);
}
}

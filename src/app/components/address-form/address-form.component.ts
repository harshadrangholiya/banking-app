import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Address, CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CardModule, ToastModule],
  templateUrl: './address-form.component.html',
  providers: [MessageService]
})
export class AddressFormComponent {
  customerId = localStorage.getItem('userId');
  addressForm: FormGroup;
  addressTypes = ['HOME', 'WORK'];
  isLoading = false;

  constructor(private fb: FormBuilder, private addressService: CustomerService, private messageService: MessageService) {
    this.addressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['HOME', Validators.required]
    });
  }

  submitAddress() {
    if (this.addressForm.invalid) return;
    this.isLoading = true;
    const address: Address = this.addressForm.value;

    this.addressService.addAddress(this.customerId, address).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address added successfully' });
        this.addressForm.reset({ addressType: 'HOME' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add address' });
        this.isLoading = false;
      }
    });
  }
}

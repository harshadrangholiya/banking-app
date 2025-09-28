import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Role } from '../../services/auth.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  roles: { name: string }[] = []; // PrimeNG dropdown expects array of objects

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private messageService: MessageService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      role:["",Validators.required]
    });
  }
  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getAllRoles().subscribe({
      next: (res: Role[]) => {
        // Map Role[] to dropdown-friendly objects
        this.roles = res.map(r => ({ name: r.name }));
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load roles' });
      }
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registerForm.value;
    const registrationData = {
      ...formData,
    };

    this.authService.register(registrationData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Registered Suxxessfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registered failed' });
      }
    });
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { AdminAccountComponent } from '../admin-account/admin-account.component';
import { TabViewModule } from 'primeng/tabview';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { ReportComponent } from '../report/report.component';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule,AdminAccountComponent,TabViewModule,ManageAccountComponent,ReportComponent,AddressFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}

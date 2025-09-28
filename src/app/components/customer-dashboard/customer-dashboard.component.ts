import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { TabViewModule } from 'primeng/tabview';
import { CustomerBalanceComponent } from '../customer-balance/customer-balance.component';
import { CustomerWithdrawComponent } from '../customer-withdraw/customer-withdraw.component';
import { CustomerDepositComponent } from '../customer-deposit/customer-deposit.component';
import { CustomerTransactionHistoryComponent } from '../customer-transaction-history/customer-transaction-history.component';
@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule,TabViewModule,CustomerBalanceComponent,CustomerWithdrawComponent,CustomerDepositComponent,CustomerTransactionHistoryComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('balanceComp') balanceComp!: CustomerBalanceComponent;

  activeIndex = 0; // optional, tracks current tab

  onTabChange(event: any) {
    this.activeIndex = event.index;

    // if "Show Balance" tab (index 0) is selected, refresh balances
    if (event.index === 0 && this.balanceComp) {
      this.balanceComp.fetchAccounts();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

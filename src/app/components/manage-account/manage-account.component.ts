import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-account',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    CurrencyPipe
  ],
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  accounts: any[] = [];
  loading = false;

  // Pagination
  totalRecords = 0;
  rows = 10; // rows per page
  page = 0;  // current page index

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts(this.page, this.rows);
  }

  loadAccounts(page: number, size: number) {
    this.loading = true;
    this.accountService.getAccounts(page, size).subscribe({
      next: (res) => {
        const data = res.data;  // the Page object
        this.accounts = data.content || [];
        this.totalRecords = data.totalElements;
        this.rows = data.size;
        this.page = data.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch accounts', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    // event.first = first row index (0-based)
    // event.rows = rows per page
    const newPage = event.first / event.rows;
    this.loadAccounts(newPage, event.rows);
  }
}

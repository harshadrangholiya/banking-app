import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, CurrencyPipe,DropdownModule,InputNumberModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  reportData: any[] = [];
  loading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {}

  fetchReport() {
    this.loading = true;
    const token = localStorage.getItem('auth_token') || '';

    this.reportService.getMonthlyReport(this.month, this.year, token).subscribe({
      next: (res) => {
        this.reportData = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch report', err);
        this.loading = false;
      }
    });
  }

  months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

// Optional: if you want to manually toggle chevron
toggleRow(customer: any) {
  customer.expanded = !customer.expanded;
}
}

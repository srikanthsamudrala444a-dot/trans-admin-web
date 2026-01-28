import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

interface MonthlyFinance {
  month: string;
  revenue: number;
  expenses: number;
}

@Component({
  selector: 'app-money-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './money-chart.component.html',
  styleUrls: ['./money-chart.component.scss'],
})
export class MoneyChartComponent implements OnInit, OnDestroy {
  @ViewChild('revenueChart', { static: true })
  revenueChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('expenseChart', { static: true })
  expenseChart!: ElementRef<HTMLCanvasElement>;

  private chart1?: Chart;
  private chart2?: Chart;

  monthlyData: MonthlyFinance[] = [
    { month: 'Jan', revenue: 12000, expenses: 8000 },
    { month: 'Feb', revenue: 13500, expenses: 8200 },
    { month: 'Mar', revenue: 15000, expenses: 9000 },
    { month: 'Apr', revenue: 17000, expenses: 9500 },
    { month: 'May', revenue: 16000, expenses: 9100 },
    { month: 'Jun', revenue: 19000, expenses: 9800 },
    { month: 'Jul', revenue: 21000, expenses: 10200 },
    { month: 'Aug', revenue: 22500, expenses: 10700 },
    { month: 'Sep', revenue: 20000, expenses: 9800 },
    { month: 'Oct', revenue: 24500, expenses: 11000 },
  ];

  expensesBreakdown = {
    Fuel: 4200,
    Maintenance: 3100,
    Salaries: 5800,
    Marketing: 2400,
    Other: 1500,
  };

  stats = {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalTrips: 0,
    avgTripAmount: 0,
  };

  ngOnInit(): void {
    Chart.register(...registerables);
    this.calculateStats();
    this.createRevenueChart();
    this.createExpenseChart();
  }

  ngOnDestroy(): void {
    this.chart1?.destroy();
    this.chart2?.destroy();
  }

  calculateStats(): void {
    this.stats.totalRevenue = this.monthlyData.reduce(
      (sum, m) => sum + m.revenue,
      0
    );
    this.stats.totalExpenses = this.monthlyData.reduce(
      (sum, m) => sum + m.expenses,
      0
    );
    this.stats.netProfit = this.stats.totalRevenue - this.stats.totalExpenses;
    this.stats.totalTrips = 1250;
    this.stats.avgTripAmount = this.stats.totalRevenue / this.stats.totalTrips;
  }

  createRevenueChart(): void {
    const ctx = this.revenueChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyData.map((m) => m.month),
        datasets: [
          {
            label: 'Revenue ($)',
            data: this.monthlyData.map((m) => m.revenue),
            borderColor: 'rgba(34,197,94,1)',
            backgroundColor: 'rgba(34,197,94,0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Expenses ($)',
            data: this.monthlyData.map((m) => m.expenses),
            borderColor: 'rgba(239,68,68,1)',
            backgroundColor: 'rgba(239,68,68,0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff', font: { size: 12 } },
          },
          title: {
            display: true,
            text: 'Monthly Revenue vs Expenses',
            color: '#fff',
            font: { size: 18, weight: 'bold' },
            padding: 15,
          },
        },
        scales: {
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      },
    });
  }

  createExpenseChart(): void {
    const ctx = this.expenseChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart2 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.expensesBreakdown),
        datasets: [
          {
            data: Object.values(this.expensesBreakdown),
            backgroundColor: [
              'rgba(239,68,68,0.8)',
              'rgba(59,130,246,0.8)',
              'rgba(168,85,247,0.8)',
              'rgba(250,204,21,0.8)',
              'rgba(34,197,94,0.8)',
            ],
            borderColor: '#1e293b',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff', font: { size: 12 }, padding: 15 },
          },
          title: {
            display: true,
            text: 'Expense Breakdown',
            color: '#fff',
            font: { size: 18, weight: 'bold' },
            padding: 15,
          },
        },
      },
    });
  }
}

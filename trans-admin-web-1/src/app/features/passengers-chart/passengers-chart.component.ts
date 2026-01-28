import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface Passenger {
  id: string;
  name: string;
  email: string;
  totalTrips: number;
  active: boolean;
  banned: boolean;
  joinedAt: string;
}

@Component({
  selector: 'app-passenger-chart',
  standalone: true,
  templateUrl: './passengers-chart.component.html',
  styleUrls: ['./passengers-chart.component.scss'],
})
export class PassengerChartComponent implements OnInit, OnDestroy {
  @ViewChild('topPassengersChart', { static: true })
  topPassengersChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('statusChart', { static: true })
  statusChart!: ElementRef<HTMLCanvasElement>;

  private chart1?: Chart;
  private chart2?: Chart;

  passengers: Passenger[] = [
    {
      id: 'p1',
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      totalTrips: 42,
      active: true,
      banned: false,
      joinedAt: '2024-11-10',
    },
    {
      id: 'p2',
      name: 'Sarah Mostafa',
      email: 'sarah@example.com',
      totalTrips: 30,
      active: true,
      banned: false,
      joinedAt: '2025-01-05',
    },
    {
      id: 'p3',
      name: 'Youssef Khaled',
      email: 'youssef@example.com',
      totalTrips: 18,
      active: false,
      banned: false,
      joinedAt: '2023-12-02',
    },
    {
      id: 'p4',
      name: 'Mariam Adel',
      email: 'mariam@example.com',
      totalTrips: 55,
      active: true,
      banned: false,
      joinedAt: '2024-09-21',
    },
    {
      id: 'p5',
      name: 'Omar Hassan',
      email: 'omar@example.com',
      totalTrips: 12,
      active: false,
      banned: true,
      joinedAt: '2022-07-13',
    },
    {
      id: 'p6',
      name: 'Laila Samir',
      email: 'laila@example.com',
      totalTrips: 37,
      active: true,
      banned: false,
      joinedAt: '2025-03-10',
    },
    {
      id: 'p7',
      name: 'Mahmoud Fathy',
      email: 'mahmoud@example.com',
      totalTrips: 8,
      active: false,
      banned: true,
      joinedAt: '2022-04-18',
    },
  ];

  statsData = {
    totalPassengers: 0,
    activePassengers: 0,
    bannedPassengers: 0,
    totalTrips: 0,
  };

  ngOnInit(): void {
    Chart.register(...registerables);
    this.calculateStats();
    this.createTopPassengersChart();
    this.createStatusChart();
  }

  ngOnDestroy(): void {
    this.chart1?.destroy();
    this.chart2?.destroy();
  }

  calculateStats(): void {
    this.statsData.totalPassengers = this.passengers.length;
    this.statsData.activePassengers = this.passengers.filter(
      (p) => p.active
    ).length;
    this.statsData.bannedPassengers = this.passengers.filter(
      (p) => p.banned
    ).length;
    this.statsData.totalTrips = this.passengers.reduce(
      (sum, p) => sum + p.totalTrips,
      0
    );
  }

  createTopPassengersChart(): void {
    const ctx = this.topPassengersChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const topPassengers = this.passengers
      .filter((p) => !p.banned)
      .sort((a, b) => b.totalTrips - a.totalTrips)
      .slice(0, 6);

    this.chart1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topPassengers.map((p) => p.name),
        datasets: [
          {
            label: 'Total Trips',
            data: topPassengers.map((p) => p.totalTrips),
            backgroundColor: [
              'rgba(59, 130, 246, 0.6)',
              'rgba(34, 197, 94, 0.6)',
              'rgba(168, 85, 247, 0.6)',
              'rgba(239, 68, 68, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top Passengers by Trips',
            color: '#fff',
            font: { size: 18, weight: 'bold' },
            padding: 15,
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
          },
        },
        scales: {
          x: {
            ticks: { color: '#fff', font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#fff', font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      },
    });
  }

  createStatusChart(): void {
    const ctx = this.statusChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const inactive =
      this.statsData.totalPassengers -
      this.statsData.activePassengers -
      this.statsData.bannedPassengers;

    this.chart2 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive', 'Banned'],
        datasets: [
          {
            data: [
              this.statsData.activePassengers,
              inactive,
              this.statsData.bannedPassengers,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)',
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
            text: 'Passenger Status Distribution',
            color: '#fff',
            font: { size: 18, weight: 'bold' },
            padding: 15,
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
          },
        },
      },
    });
  }
}

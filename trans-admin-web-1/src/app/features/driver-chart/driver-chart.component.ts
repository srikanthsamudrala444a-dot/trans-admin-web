// driver-chart.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface Driver {
  id: string;
  vehicleNumber: string;
  drivingLicense?: string;
  rating: number;
  contactNumber?: number;
  totalRatingPoints: number;
  ratingCount: number;
  averageRating: number;
  subscription?: boolean;
  onDuty: boolean;
  status?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  available: boolean;
}

@Component({
  selector: 'app-driver-chart',
  standalone: true,
  templateUrl: './driver-chart.component.html',
  styleUrls: ['./driver-chart.component.scss'],
})
export class DriverChartComponent implements OnInit, OnDestroy {
  @ViewChild('ratingChart', { static: true })
  ratingChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart', { static: true })
  statusChart!: ElementRef<HTMLCanvasElement>;

  private chart1: Chart | undefined;
  private chart2: Chart | undefined;

  drivers: Driver[] = [
    {
      id: '68178ec496802864f8df861a',
      vehicleNumber: 'string',
      drivingLicense: 'string',
      rating: 0.10000000149011612,
      contactNumber: 1234,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: true,
      onDuty: false,
      status: 'VERIFIED',
      verifiedAt: '2025-10-05T06:20:54.176',
      verifiedBy: '68d163ab27c1ec731c730dc8',
      available: true,
    },
    {
      id: '68179a6cb55cd821e47e2428',
      vehicleNumber: 'CA1234XYZ',
      drivingLicense: 'D1234567CA',
      rating: 4.800000190734863,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: true,
      onDuty: false,
      available: true,
    },
    {
      id: '68179b7fb55cd821e47e2429',
      vehicleNumber: 'FL1122MNP',
      drivingLicense: 'L2345678FL',
      rating: 4.5,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: true,
      onDuty: false,
      available: false,
    },
    {
      id: '68179b92b55cd821e47e242a',
      vehicleNumber: 'TX9087BTR',
      drivingLicense: 'A5678921TX',
      rating: 4.900000095367432,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: true,
      onDuty: false,
      available: false,
    },
    {
      id: '68179bb1b55cd821e47e242b',
      vehicleNumber: 'NY5678LMN',
      drivingLicense: 'J8901234NY',
      rating: 4.599999904632568,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: false,
      onDuty: false,
      available: false,
    },
    {
      id: 'string',
      vehicleNumber: 'string',
      drivingLicense: 'string',
      rating: 0.10000000149011612,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      subscription: true,
      onDuty: false,
      available: true,
    },
    {
      id: '68a2dd9b4553a51c7b969abd',
      vehicleNumber: 'MH02DG2346',
      rating: 0,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      onDuty: false,
      available: false,
    },
    {
      id: '68a30fae4553a51c7b969abf',
      vehicleNumber: 'MP04KO5433',
      rating: 0,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      onDuty: false,
      status: 'VERIFIED',
      verifiedAt: '2025-10-05T06:26:17.425',
      verifiedBy: '68d163ab27c1ec731c730dc8',
      available: false,
    },
    {
      id: '68a313e74553a51c7b969ac1',
      vehicleNumber: 'GJ19HJ2345',
      rating: 0,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      onDuty: false,
      available: false,
    },
    {
      id: '68a3153d4553a51c7b969ac2',
      vehicleNumber: 'Gj04GH2003',
      rating: 0,
      totalRatingPoints: 0,
      ratingCount: 0,
      averageRating: 0,
      onDuty: false,
      available: false,
    },
  ];

  statsData = {
    totalDrivers: 0,
    availableDrivers: 0,
    onDutyDrivers: 0,
    verifiedDrivers: 0,
    avgRating: 0,
    subscribedDrivers: 0,
  };

  ngOnInit(): void {
    Chart.register(...registerables);
    this.calculateStats();
    this.createRatingChart();
    this.createStatusChart();
  }

  ngOnDestroy(): void {
    if (this.chart1) this.chart1.destroy();
    if (this.chart2) this.chart2.destroy();
  }

  calculateStats(): void {
    this.statsData.totalDrivers = this.drivers.length;
    this.statsData.availableDrivers = this.drivers.filter(
      (d) => d.available
    ).length;
    this.statsData.onDutyDrivers = this.drivers.filter((d) => d.onDuty).length;
    this.statsData.verifiedDrivers = this.drivers.filter(
      (d) => d.status === 'VERIFIED'
    ).length;
    this.statsData.subscribedDrivers = this.drivers.filter(
      (d) => d.subscription
    ).length;

    const ratingsSum = this.drivers.reduce((sum, d) => sum + d.rating, 0);
    this.statsData.avgRating = Number(
      (ratingsSum / this.drivers.length).toFixed(2)
    );
  }

  createRatingChart(): void {
    const ctx = this.ratingChart.nativeElement.getContext('2d');

    // Get top 6 drivers by rating
    const topDrivers = this.drivers
      .filter((d) => d.vehicleNumber !== 'string')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);

    if (ctx) {
      this.chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topDrivers.map((d) => d.vehicleNumber),
          datasets: [
            {
              label: 'Driver Rating',
              data: topDrivers.map((d) => d.rating),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
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
              text: 'Top Driver Ratings',
              font: { size: 18, weight: 'bold' },
              color: '#fff',
              padding: 15,
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
            },
          },
          scales: {
            x: {
              ticks: { color: '#fff', font: { size: 11 } },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
              beginAtZero: true,
              max: 5,
              ticks: { color: '#fff', font: { size: 11 } },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
          },
        },
      });
    }
  }

  createStatusChart(): void {
    const ctx = this.statusChart.nativeElement.getContext('2d');

    if (ctx) {
      this.chart2 = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Available', 'Unavailable', 'On Duty', 'Subscribed'],
          datasets: [
            {
              data: [
                this.statsData.availableDrivers,
                this.statsData.totalDrivers - this.statsData.availableDrivers,
                this.statsData.onDutyDrivers,
                this.statsData.subscribedDrivers,
              ],
              backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
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
              labels: {
                color: '#fff',
                font: { size: 12 },
                padding: 15,
              },
            },
            title: {
              display: true,
              text: 'Driver Status Distribution',
              font: { size: 18, weight: 'bold' },
              color: '#fff',
              padding: 15,
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
            },
          },
        },
      });
    }
  }
}

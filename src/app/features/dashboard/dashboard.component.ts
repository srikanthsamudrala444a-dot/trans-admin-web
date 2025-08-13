import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardStats, ChartData } from '../../core/models/dashboard.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,HttpClientModule],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your cab service.</p>
      </div>
      
      <div class="stats-grid">
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon class="stat-icon rides">local_taxi</mat-icon>
              <div class="stat-content">
                <h3>{{stats?.totalRides?.today || 0}}</h3>
                <p>Rides Today</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon class="stat-icon drivers">person</mat-icon>
              <div class="stat-content">
                <h3>{{stats?.activeDrivers || 0}}</h3>
                <p>Active Drivers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon class="stat-icon passengers">people</mat-icon>
              <div class="stat-content">
                <h3>{{stats?.totalPassengers || 0}}</h3>
                <p>Total Passengers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stats-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              <div class="stat-content">
                <h3>\${{stats?.revenue?.today || 0}}</h3>
                <p>Revenue Today</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="charts-section">
        <div class="charts-grid">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Weekly Rides Overview</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-placeholder">
                <mat-icon>bar_chart</mat-icon>
                <p>Chart.js integration ready</p>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Revenue Trends</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-placeholder">
                <mat-icon>show_chart</mat-icon>
                <p>Line chart placeholder</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
      
      <div class="quick-actions">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Add Driver
              </button>
              <button mat-raised-button color="accent">
                <mat-icon>directions_car</mat-icon>
                Add Vehicle
              </button>
              <button mat-raised-button>
                <mat-icon>notifications</mat-icon>
                Send Notification
              </button>
              <button mat-raised-button>
                <mat-icon>settings</mat-icon>
                Manage Settings
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 32px;
    }
    
    .page-header h1 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 400;
    }
    
    .page-header p {
      margin: 0;
      color: #666;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .stats-card {
      transition: transform 0.2s ease;
    }
    
    .stats-card:hover {
      transform: translateY(-4px);
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .stat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-icon.rides {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .stat-icon.drivers {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }
    
    .stat-icon.passengers {
      background-color: #e8f5e8;
      color: #388e3c;
    }
    
    .stat-icon.revenue {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .stat-content h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }
    
    .stat-content p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .charts-section {
      margin-bottom: 32px;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .chart-card {
      min-height: 400px;
    }
    
    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }
    
    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .action-buttons button {
      flex: 1;
      min-width: 150px;
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-buttons button {
        flex: none;
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.stats = {
        totalRides: {
          today: 45,
          week: 312,
          month: 1248
        },
        activeDrivers: 28,
        totalPassengers: 1543,
        revenue: {
          today: 2150,
          week: 15780,
          month: 64320
        },
        liveRides: 12
      };
      this.isLoading = false;
    }, 1000);
  }
}
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Inline interfaces and enums for operational reports
export enum ReportTimePeriodsEnum {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  IDLE = 'idle',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum MaintenanceType {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  SCHEDULED = 'scheduled',
  BREAKDOWN = 'breakdown'
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export interface VehicleUtilization {
  vehicleId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  totalRides: number;
  totalDistance: number;
  totalHours: number;
  utilizationRate: number;
  revenue: number;
  revenuePerKm: number;
  lastRideTime: string;
  location: { lat: number; lng: number; address: string };
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  licensePlate: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  technician?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  nextServiceDue?: string;
  mileage: number;
}

export interface GeographicalDemand {
  area: string;
  coordinates: { lat: number; lng: number };
  totalRides: number;
  totalRevenue: number;
  averageWaitTime: number;
  peakHours: string[];
  demandIntensity: 'low' | 'medium' | 'high' | 'very_high';
  supplyDemandRatio: number;
}

export interface OperationalMetrics {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  idleVehicles: number;
  averageUtilization: number;
  totalFleetRevenue: number;
  maintenanceCosts: number;
  fuelCosts: number;
  netProfit: number;
}

export interface OperationalData {
  metrics: OperationalMetrics;
  vehicleUtilization: VehicleUtilization[];
  maintenanceSchedule: MaintenanceSchedule[];
  geographicalDemand: GeographicalDemand[];
  timePeriod: ReportTimePeriodsEnum;
  startDate: string;
  endDate: string;
}

// Inline service for operational data
export class OperationalReportsService {
  getOperationalData(timePeriod: ReportTimePeriodsEnum): Observable<OperationalData> {
    const mockData = this.generateMockData(timePeriod);
    return of(mockData).pipe(delay(800));
  }

  private generateMockData(timePeriod: ReportTimePeriodsEnum): OperationalData {
    const multipliers: Record<ReportTimePeriodsEnum, number> = {
      [ReportTimePeriodsEnum.TODAY]: 0.1,
      [ReportTimePeriodsEnum.YESTERDAY]: 0.1,
      [ReportTimePeriodsEnum.LAST_7_DAYS]: 0.7,
      [ReportTimePeriodsEnum.LAST_30_DAYS]: 3,
      [ReportTimePeriodsEnum.THIS_MONTH]: 3,
      [ReportTimePeriodsEnum.LAST_MONTH]: 3
    };

    const multiplier = multipliers[timePeriod] || 1;
    const totalVehicles = 150;
    const activeVehicles = Math.floor(120 * multiplier);
    const vehiclesInMaintenance = Math.floor(15 * multiplier);
    const idleVehicles = totalVehicles - activeVehicles - vehiclesInMaintenance;

    // Generate vehicle utilization data
    const vehicleUtilization: VehicleUtilization[] = [];
    const vehicleMakes = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Ford'];
    const vehicleModels = ['Camry', 'Corolla', 'Accord', 'Civic', 'Altima', 'Elantra'];
    
    for (let i = 0; i < 50; i++) {
      const make = vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)];
      const model = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const baseRides = Math.floor(Math.random() * 100) + 50;
      const totalRides = Math.floor(baseRides * multiplier);
      const totalDistance = totalRides * (Math.random() * 15 + 5); // 5-20 km per ride
      const totalHours = totalRides * (Math.random() * 0.5 + 0.3); // 0.3-0.8 hours per ride
      
      vehicleUtilization.push({
        vehicleId: `VH${String(i + 1).padStart(3, '0')}`,
        licensePlate: `ABC${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        make,
        model,
        year: 2018 + Math.floor(Math.random() * 6),
        status: this.getRandomVehicleStatus(),
        totalRides,
        totalDistance: Number(totalDistance.toFixed(1)),
        totalHours: Number(totalHours.toFixed(1)),
        utilizationRate: Number((Math.random() * 80 + 20).toFixed(1)), // 20-100%
        revenue: Number((totalRides * 15.5).toFixed(2)),
        revenuePerKm: Number((15.5 / (Math.random() * 10 + 8)).toFixed(2)),
        lastRideTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.1,
          lng: -122.4194 + (Math.random() - 0.5) * 0.1,
          address: `${Math.floor(Math.random() * 9999)} Main St, San Francisco`
        }
      });
    }

    // Generate maintenance schedule
    const maintenanceSchedule: MaintenanceSchedule[] = [];
    const maintenanceTypes = ['Oil Change', 'Tire Replacement', 'Brake Service', 'Engine Tune-up', 'AC Service'];
    
    for (let i = 0; i < 25; i++) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) - 15);
      
      maintenanceSchedule.push({
        id: `MNT${String(i + 1).padStart(3, '0')}`,
        vehicleId: `VH${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
        licensePlate: `ABC${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        type: this.getRandomMaintenanceType(),
        status: this.getRandomMaintenanceStatus(),
        description: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        estimatedCost: Number((Math.random() * 1000 + 200).toFixed(2)),
        actualCost: Math.random() > 0.5 ? Number((Math.random() * 1000 + 200).toFixed(2)) : undefined,
        technician: Math.random() > 0.3 ? `Tech ${Math.floor(Math.random() * 10) + 1}` : undefined,
        priority: this.getRandomPriority(),
        mileage: Math.floor(Math.random() * 100000) + 50000
      });
    }

    // Generate geographical demand data
    const areas = [
      'Downtown', 'Financial District', 'Mission District', 'Castro District',
      'Chinatown', 'North Beach', 'Pacific Heights', 'SOMA', 'Nob Hill', 'Richmond'
    ];
    
    const geographicalDemand: GeographicalDemand[] = areas.map((area, index) => ({
      area,
      coordinates: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      },
      totalRides: Math.floor((Math.random() * 1000 + 500) * multiplier),
      totalRevenue: Number(((Math.random() * 15000 + 7500) * multiplier).toFixed(2)),
      averageWaitTime: Number((Math.random() * 10 + 3).toFixed(1)),
      peakHours: ['7-9 AM', '5-7 PM'],
      demandIntensity: this.getRandomDemandIntensity(),
      supplyDemandRatio: Number((Math.random() * 1.5 + 0.5).toFixed(2))
    }));

    const metrics: OperationalMetrics = {
      totalVehicles,
      activeVehicles,
      vehiclesInMaintenance,
      idleVehicles,
      averageUtilization: Number((vehicleUtilization.reduce((sum, v) => sum + v.utilizationRate, 0) / vehicleUtilization.length).toFixed(1)),
      totalFleetRevenue: Number(vehicleUtilization.reduce((sum, v) => sum + v.revenue, 0).toFixed(2)),
      maintenanceCosts: Number(maintenanceSchedule.reduce((sum, m) => sum + (m.actualCost || m.estimatedCost), 0).toFixed(2)),
      fuelCosts: Number((vehicleUtilization.reduce((sum, v) => sum + v.totalDistance, 0) * 0.15).toFixed(2)), // $0.15 per km
      netProfit: 0 // Will be calculated
    };

    metrics.netProfit = Number((metrics.totalFleetRevenue - metrics.maintenanceCosts - metrics.fuelCosts).toFixed(2));

    return {
      metrics,
      vehicleUtilization,
      maintenanceSchedule,
      geographicalDemand,
      timePeriod,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
  }

  private getRandomVehicleStatus(): VehicleStatus {
    const statuses = [VehicleStatus.ACTIVE, VehicleStatus.IDLE, VehicleStatus.MAINTENANCE];
    const weights = [0.8, 0.15, 0.05]; // 80% active, 15% idle, 5% maintenance
    const random = Math.random();
    
    if (random < weights[0]) return VehicleStatus.ACTIVE;
    if (random < weights[0] + weights[1]) return VehicleStatus.IDLE;
    return VehicleStatus.MAINTENANCE;
  }

  private getRandomMaintenanceType(): MaintenanceType {
    const types = [MaintenanceType.ROUTINE, MaintenanceType.SCHEDULED, MaintenanceType.URGENT, MaintenanceType.BREAKDOWN];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomMaintenanceStatus(): MaintenanceStatus {
    const statuses = [MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.COMPLETED, MaintenanceStatus.OVERDUE];
    const weights = [0.3, 0.2, 0.4, 0.1]; // 30% pending, 20% in progress, 40% completed, 10% overdue
    const random = Math.random();
    
    if (random < weights[0]) return MaintenanceStatus.PENDING;
    if (random < weights[0] + weights[1]) return MaintenanceStatus.IN_PROGRESS;
    if (random < weights[0] + weights[1] + weights[2]) return MaintenanceStatus.COMPLETED;
    return MaintenanceStatus.OVERDUE;
  }

  private getRandomPriority(): 'low' | 'medium' | 'high' | 'critical' {
    const priorities = ['low', 'medium', 'high', 'critical'] as const;
    const weights = [0.4, 0.35, 0.2, 0.05]; // 40% low, 35% medium, 20% high, 5% critical
    const random = Math.random();
    
    if (random < weights[0]) return 'low';
    if (random < weights[0] + weights[1]) return 'medium';
    if (random < weights[0] + weights[1] + weights[2]) return 'high';
    return 'critical';
  }

  private getRandomDemandIntensity(): 'low' | 'medium' | 'high' | 'very_high' {
    const intensities = ['low', 'medium', 'high', 'very_high'] as const;
    const weights = [0.2, 0.4, 0.3, 0.1]; // 20% low, 40% medium, 30% high, 10% very high
    const random = Math.random();
    
    if (random < weights[0]) return 'low';
    if (random < weights[0] + weights[1]) return 'medium';
    if (random < weights[0] + weights[1] + weights[2]) return 'high';
    return 'very_high';
  }
}

@Component({
  selector: 'app-operational-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './operational-reports.component.html',
  styleUrls: ['./operational-reports.component.scss']
})
export class OperationalReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('heatmapCanvas', { static: false }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;

  // Form controls
  timePeriodControl = new FormControl('last_7_days');
  
  // Data properties
  operationalData: OperationalData | null = null;
  loading = false;
  selectedTabIndex = 0;
  
  // Table data sources
  vehicleDisplayedColumns = ['licensePlate', 'make', 'model', 'status', 'utilizationRate', 'totalRides', 'revenue', 'actions'];
  maintenanceDisplayedColumns = ['licensePlate', 'type', 'status', 'scheduledDate', 'priority', 'estimatedCost', 'actions'];
  demandDisplayedColumns = ['area', 'totalRides', 'revenue', 'waitTime', 'intensity', 'ratio'];

  // Service instance
  private operationalService = new OperationalReportsService();

  ngOnInit(): void {
    this.loadOperationalData();
    
    // Listen for time period changes
    this.timePeriodControl.valueChanges.subscribe(() => {
      this.loadOperationalData();
    });
  }

  ngAfterViewInit(): void {
    // Initialize heat map after view is ready
    setTimeout(() => {
      if (this.operationalData) {
        this.drawHeatMap();
      }
    }, 100);
  }

  loadOperationalData(): void {
    this.loading = true;
    const timePeriod = this.timePeriodControl.value || 'last_7_days';
    
    this.operationalService.getOperationalData(timePeriod as ReportTimePeriodsEnum).subscribe({
      next: (data: OperationalData) => {
        this.operationalData = data;
        this.loading = false;
        
        // Redraw heat map when data changes
        setTimeout(() => this.drawHeatMap(), 100);
      },
      error: (error: any) => {
        console.error('Error loading operational data:', error);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadOperationalData();
  }

  exportReport(): void {
    if (!this.operationalData) return;
    
    const csvContent = this.generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `operational-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private generateCSVReport(): string {
    if (!this.operationalData) return '';

    const lines = [];
    lines.push('Operational Report');
    lines.push(`Generated on: ${new Date().toLocaleString()}`);
    lines.push(`Time Period: ${this.getTimePeriodLabel(this.timePeriodControl.value || 'last_7_days')}`);
    lines.push('');
    
    // Operational metrics
    lines.push('Operational Metrics');
    const metrics = this.operationalData.metrics;
    lines.push(`Total Vehicles,${metrics.totalVehicles}`);
    lines.push(`Active Vehicles,${metrics.activeVehicles}`);
    lines.push(`Vehicles in Maintenance,${metrics.vehiclesInMaintenance}`);
    lines.push(`Idle Vehicles,${metrics.idleVehicles}`);
    lines.push(`Average Utilization,${metrics.averageUtilization}%`);
    lines.push(`Total Fleet Revenue,$${metrics.totalFleetRevenue}`);
    lines.push(`Maintenance Costs,$${metrics.maintenanceCosts}`);
    lines.push(`Fuel Costs,$${metrics.fuelCosts}`);
    lines.push(`Net Profit,$${metrics.netProfit}`);
    
    return lines.join('\n');
  }

  getTimePeriodLabel(period: string): string {
    switch (period) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'last_7_days': return 'Last 7 Days';
      case 'last_30_days': return 'Last 30 Days';
      case 'this_month': return 'This Month';
      case 'last_month': return 'Last Month';
      default: return 'Last 7 Days';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'maintenance': return 'status-maintenance';
      case 'idle': return 'status-idle';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-progress';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'critical': return 'priority-critical';
      default: return '';
    }
  }

  getIntensityClass(intensity: string): string {
    switch (intensity.toLowerCase()) {
      case 'low': return 'intensity-low';
      case 'medium': return 'intensity-medium';
      case 'high': return 'intensity-high';
      case 'very_high': return 'intensity-very-high';
      default: return '';
    }
  }

  getUtilizationColor(rate: number): string {
    if (rate >= 80) return '#4caf50'; // Green
    if (rate >= 60) return '#ff9800'; // Orange
    if (rate >= 40) return '#ffc107'; // Yellow
    return '#f44336'; // Red
  }

  private drawHeatMap(): void {
    if (!this.heatmapCanvas || !this.operationalData) return;

    const canvas = this.heatmapCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw geographical demand heat map
    const data = this.operationalData.geographicalDemand;
    const maxRides = Math.max(...data.map(d => d.totalRides));

    data.forEach(area => {
      const intensity = area.totalRides / maxRides;
      const x = (area.coordinates.lng + 122.5) * 3000; // Normalize coordinates
      const y = (37.8 - area.coordinates.lat) * 4000;
      
      // Ensure coordinates are within canvas bounds
      const canvasX = Math.max(50, Math.min(canvas.width - 50, x));
      const canvasY = Math.max(50, Math.min(canvas.height - 50, y));
      
      // Draw heat point
      const radius = 20 + (intensity * 30);
      const alpha = 0.3 + (intensity * 0.5);
      
      const gradient = ctx.createRadialGradient(canvasX, canvasY, 0, canvasX, canvasY, radius);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw area label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(area.area, canvasX - 30, canvasY + 5);
    });

    // Draw legend
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Demand Intensity Heat Map', 20, 30);
    
    // Draw legend gradient
    const legendGradient = ctx.createLinearGradient(20, canvas.height - 60, 200, canvas.height - 60);
    legendGradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
    legendGradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
    
    ctx.fillStyle = legendGradient;
    ctx.fillRect(20, canvas.height - 70, 180, 20);
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Low', 20, canvas.height - 30);
    ctx.fillText('High', 170, canvas.height - 30);
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 2) { // Heat map tab
      setTimeout(() => this.drawHeatMap(), 100);
    }
  }

  viewVehicleDetails(vehicle: VehicleUtilization): void {
    // Navigate to vehicle details or open dialog
    console.log('View vehicle details:', vehicle);
  }

  viewMaintenanceDetails(maintenance: MaintenanceSchedule): void {
    // Navigate to maintenance details or open dialog
    console.log('View maintenance details:', maintenance);
  }
}

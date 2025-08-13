import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="sidebar-content">
      <div class="logo-section">
        <h2>CabAdmin</h2>
      </div>
      
      <mat-nav-list>
        <ng-container *ngFor="let item of menuItems">
          <mat-list-item 
            *ngIf="hasPermission(item.roles)"
            [class.active]="isActive(item.route)"
            (click)="goto(item.route)">
            <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
            <span matListItemTitle>{{item.label}}</span>
          </mat-list-item>
        </ng-container>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar-content {
      height: 100%;
      background: #263238;
      color: white;
    }
    
    .logo-section {
      padding: 20px;
      border-bottom: 1px solid #37474f;
      text-align: center;
    }
    
    .logo-section h2 {
      margin: 0;
      color: #4fc3f7;
      font-weight: 300;
    }
    
    mat-nav-list {
      padding-top: 0;
    }
    
    mat-list-item {
      color: #b0bec5;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    mat-list-item:hover,
    mat-list-item.active {
      background-color: #37474f;
      color: white;
    }
    
    mat-list-item.active {
      border-right: 3px solid #4fc3f7;
    }
    
    mat-icon {
      color: inherit;
    }
  `]
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Rides', icon: 'local_taxi', route: '/rides' },
    { label: 'Drivers', icon: 'person', route: '/drivers' },
    { label: 'Passengers', icon: 'people', route: '/passengers' },
    { label: 'Vehicles', icon: 'directions_car', route: '/vehicles' },
    { label: 'Support', icon: 'support_agent', route: '/support' },
    { label: 'Payments', icon: 'payment', route: '/payments' },
    { label: 'Notifications', icon: 'notifications', route: '/notifications' },
    { label: 'Settings', icon: 'settings', route: '/settings', roles: ['admin'] },
    { label: 'Audit Logs', icon: 'history', route: '/audit-logs', roles: ['admin'] }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goto(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  hasPermission(roles?: string[]): boolean {
    if (!roles) return true;
    return this.authService.hasAnyRole(roles);
  }
}
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
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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
    { label: 'Rewards', icon: 'card_giftcard', route: '/rewards' },
    { label: 'Performance Reports', icon: 'analytics', route: '/performance-reports' },
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
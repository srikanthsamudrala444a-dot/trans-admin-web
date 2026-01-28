import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'rides',
        loadComponent: () => import('./features/rides/rides.component').then(c => c.RidesComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/drivers/drivers.component').then(c => c.DriversComponent)
      },
      {
        path: 'passengers',
        loadComponent: () => import('./features/passengers/passengers.component').then(c => c.PassengersComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/vehicles/vehicles.component').then(c => c.VehiclesComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./features/support/support.component').then(c => c.SupportComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payments.component').then(c => c.PaymentsComponent)
      },
      {
        path: 'rewards',
        loadComponent: () => import('./features/rewards/rewards.component').then(c => c.RewardsComponent)
      },
      {
        path: 'performance-reports',
        loadComponent: () => import('./features/performance-reports/performance-reports.component').then(c => c.PerformanceReportsComponent)
      },
      {
        path: 'operational-reports',
        loadComponent: () => import('./features/operational-reports/operational-reports.component').then(c => c.OperationalReportsComponent)
      },
      {
        path: 'reviews-ratings',
        loadComponent: () => import('./features/reviews-ratings/reviews-ratings.component').then(c => c.ReviewsRatingsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(c => c.NotificationsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(c => c.SettingsComponent)
      },
      {
        path: 'system-settings',
        redirectTo: '/settings',
        pathMatch: 'full'
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./features/audit-logs/audit-logs.component').then(c => c.AuditLogsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'multi-role-access-control',
        loadComponent: () => import('./features/multi-role-access-control/multi-role-access-control.component').then(c => c.MultiRoleAccessControlComponent)
      },
      {
        path: 'passengers/:passengerId',
        loadComponent: () => import('./features/passengers/passenger-details.component').then(c => c.PassengerDetailsComponent)
      },
      {
        path: 'drivers/:driverId',
        loadComponent: () => import('./features/driver-details/driver-details.component').then(c => c.DriverDetailsComponent)
      },
      {
        path: 'drivers/:driverId/rides-history',
        loadComponent: () => import('./features/driver-rides-history/driver-rides-history.component').then(c => c.DriverRidesHistoryComponent)
      },
      {
        path: 'vehicles/:vehicleId',
        loadComponent: () => import('./features/vehicles/vehicle-details.component').then(c => c.VehicleDetailsComponent)
      },
      {
        path: 'rides/:rideId',
        loadComponent: () => import('./features/rides/ride-details.component').then(c => c.RideDetailsComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  },
  {
    path: 'driver-location',
    loadComponent: () => import('./features/driver-location/driver-location.component').then(c => c.DriverLocationComponent)
  },
  {
    path: 'driver-documents',
    loadComponent: () => import('./features/driver-documents/driver-documents.component').then(c => c.DriverDocumentsComponent)
  },
  { path: '', redirectTo: 'rides', pathMatch: 'full' }
];
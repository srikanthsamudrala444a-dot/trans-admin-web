import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriverService } from '../../core/services/driver.service';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {
  driver: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private router: Router, private driverService: DriverService) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.paramMap.get('driverId');
    if (driverId) {
      this.driverService.getDriverById(driverId).subscribe({
        next: (data: any) => {
          this.driver = data.driver || data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load driver details:', err); // Debug log
          this.errorMessage = err?.error?.message || err?.message || 'Failed to load driver details';
          this.isLoading = false;
        }
      });
    }
  }

  backToDrivers() {
    this.router.navigate(['/drivers']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Passenger } from '../../core/models/ride.model';
import { PassengersService } from '../../core/services/passengers.service';
import { RideService } from '../../core/services/rides.service';
import { CommunicationHistoryDialogComponent } from './communication-history-dialog.component';
import { PassengerActivityAnalysisComponent } from './passenger-activity-analysis.component';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule, 
    MatProgressSpinnerModule, 
    MatTooltipModule,
    PassengerActivityAnalysisComponent
  ],
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit {
  passenger: Passenger | null = null;
  isLoading = true;
  errorMessage = '';
  rideId: string = '';
  ride: any = null;
  isUpdatingStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passengersService: PassengersService,
    private rideService: RideService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const passengerId = this.route.snapshot.paramMap.get('passengerId');
    if (passengerId) {
      this.passengersService.getPassengerById(passengerId).subscribe({
        next: (data: any) => {
          this.passenger = data.passenger || data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load passenger details';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'No passengerId provided in the route.';
      this.isLoading = false;
    }
  }

  backToPassengers() {
    this.router.navigate(['/passengers']);
  }

  openCommunicationHistory() {
    if (!this.passenger) {
      return;
    }

    const dialogRef = this.dialog.open(CommunicationHistoryDialogComponent, {
      width: '90vw',
      maxWidth: '1000px',
      height: '80vh',
      data: {
        passengerId: this.passenger.id,
        passengerName: this.passenger.firstName || 'Unknown'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Communication history dialog closed');
    });
  }

  // Account Status Control Methods
  reactivateAccount() {
    if (!this.passenger?.id) {
      alert('No passenger ID available');
      return;
    }

    const reason = prompt(`Enter reason for reactivating ${this.passenger.firstName}'s account:`, 
      'Account issues resolved - reactivated by admin');
    
    if (reason !== null && confirm(`Are you sure you want to reactivate ${this.passenger.firstName}'s account?`)) {
      this.isUpdatingStatus = true;
      this.passengersService.reactivatePassenger(this.passenger.id, reason).subscribe({
        next: (response) => {
          console.log('Account reactivated successfully:', response);
          const isMock = response.data?.note?.includes('Mock operation');
          const statusMsg = isMock ? 
            `${this.passenger?.firstName}'s account reactivation has been logged.\n\nNote: This is currently a demonstration - dedicated reactivate API is needed for full implementation.` :
            `${this.passenger?.firstName}'s account has been reactivated and is now active.`;
          alert(statusMsg);
          
          // Update local passenger data to reflect the change
          if (this.passenger) {
            this.passenger.isOnHold = false;
            this.passenger.isActive = true;
            this.passenger.holdReason = undefined;
          }
          
          this.isUpdatingStatus = false;
        },
        error: (err) => {
          console.error('Failed to reactivate account:', err);
          alert('Failed to reactivate account. Please try again.');
          this.isUpdatingStatus = false;
        }
      });
    } else if (reason === null) {
      // User cancelled
      this.isUpdatingStatus = false;
    }
  }

  suspendAccount() {
    if (!this.passenger?.id) {
      alert('No passenger ID available');
      return;
    }

    const reason = prompt(`Enter reason for suspending ${this.passenger.firstName}'s account:`, 
      'Terms of service violation - repeated fraudulent activity or abuse');
    
    if (reason !== null) {
      if (confirm(`Are you sure you want to SUSPEND ${this.passenger.firstName}'s account? This will freeze their account and prevent them from using the service.`)) {
        this.isUpdatingStatus = true;
        this.passengersService.suspendPassenger(this.passenger.id, reason).subscribe({
          next: (response) => {
            console.log('Account suspended (frozen/on hold) successfully:', response);
            const isMock = response.data?.note?.includes('Mock operation');
            const statusMsg = isMock ? 
              `${this.passenger?.firstName}'s account suspension has been logged.\n\nNote: This is currently a demonstration - dedicated suspend API is needed for full implementation.\n\nIn production, the passenger would not be able to use the service until reactivated.` :
              `${this.passenger?.firstName}'s account has been suspended and frozen.\n\nThe passenger cannot use the service until reactivated.`;
            alert(statusMsg);
            
            // Update local passenger data to reflect the change
            if (this.passenger) {
              this.passenger.isOnHold = true;
              this.passenger.holdReason = reason;
            }
            
            this.isUpdatingStatus = false;
          },
          error: (err) => {
            console.error('Failed to suspend account:', err);
            alert('Failed to suspend account. Please try again.');
            this.isUpdatingStatus = false;
          }
        });
      } else {
        this.isUpdatingStatus = false;
      }
    } else {
      // User cancelled
      this.isUpdatingStatus = false;
    }
  }

  deactivateAccount() {
    if (!this.passenger?.id) {
      alert('No passenger ID available');
      return;
    }

    const reason = prompt(`Enter reason for deactivating ${this.passenger.firstName}'s account:`, 
      'Account deactivated by admin');
    
    if (reason !== null) {
      if (confirm(`Are you sure you want to PERMANENTLY DEACTIVATE ${this.passenger.firstName}'s account? This will DELETE their account and they will not be able to use the service.`)) {
        this.isUpdatingStatus = true;
        this.passengersService.deactivatePassenger(this.passenger.id, reason).subscribe({
          next: (response) => {
            console.log('Account deactivated (deleted) successfully:', response);
            alert(`${this.passenger?.firstName}'s account has been permanently deactivated and deleted`);
            // After deletion, redirect back to passengers list since the account no longer exists
            this.router.navigate(['/passengers']);
          },
          error: (err) => {
            console.error('Failed to deactivate account:', err);
            alert('Failed to deactivate account. Please try again.');
            this.isUpdatingStatus = false;
          }
        });
      }
    }
  }

  private refreshPassengerData() {
    if (!this.passenger?.id) return;
    
    this.passengersService.getPassengerById(this.passenger.id).subscribe({
      next: (data: any) => {
        this.passenger = data.passenger || data;
      },
      error: (err: any) => {
        console.error('Failed to refresh passenger data:', err);
      }
    });
  }

  getAccountStatus(): string {
    if (!this.passenger) return 'Unknown';
    
    if (this.passenger.isBanned) {
      return 'Deactivated';
    } else if (this.passenger.isOnHold) {
      return 'Suspended (On Hold)';
    } else if (this.passenger.isActive !== false) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  }
}

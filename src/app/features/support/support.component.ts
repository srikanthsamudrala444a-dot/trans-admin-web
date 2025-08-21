import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule
  ],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  displayedColumns = ['id', 'user', 'subject', 'priority', 'status', 'assignee', 'created', 'actions'];
  tickets: any[] = [];
  
  openTickets = 0;
  inProgressTickets = 0;
  closedTickets = 0;

  ngOnInit(): void {
    this.loadTickets();
  }

  private loadTickets(): void {
    // Mock data
    this.tickets = [
      {
        id: '001',
        userName: 'Alice Johnson',
        userType: 'passenger',
        subject: 'Driver was late and rude',
        category: 'Service Quality',
        priority: 'high',
        status: 'open',
        assignee: null,
        createdAt: new Date('2024-01-15T10:30:00')
      },
      {
        id: '002',
        userName: 'John Smith',
        userType: 'driver',
        subject: 'Payment not received for last ride',
        category: 'Payment Issue',
        priority: 'medium',
        status: 'in-progress',
        assignee: 'Support Agent 1',
        createdAt: new Date('2024-01-14T14:20:00')
      },
      {
        id: '003',
        userName: 'Bob Brown',
        userType: 'passenger',
        subject: 'Cannot cancel ride',
        category: 'Technical Issue',
        priority: 'low',
        status: 'closed',
        assignee: 'Support Agent 2',
        createdAt: new Date('2024-01-13T09:15:00')
      }
    ];

    this.calculateStats();
  }

  private calculateStats(): void {
    this.openTickets = this.tickets.filter(t => t.status === 'open').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'in-progress').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'closed').length;
  }
}
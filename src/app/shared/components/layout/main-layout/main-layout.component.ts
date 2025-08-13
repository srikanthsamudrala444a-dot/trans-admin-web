import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-header (sidebarToggle)="drawer.toggle()"></app-header>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav 
          #drawer
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="!(isHandset$ | async)"
          class="sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        
        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .sidenav-container {
      flex: 1;
    }
    
    .sidenav {
      width: 280px;
      background: #263238;
    }
    
    .main-content {
      background: #fafafa;
    }
    
    .content-wrapper {
      padding: 24px;
      min-height: calc(100vh - 64px);
    }
    
    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(map(result => result.matches));

//  constructor(private breakpointObserver: BreakpointObserver) {}

  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }
}
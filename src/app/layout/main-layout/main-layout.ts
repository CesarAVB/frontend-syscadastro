// src/app/main-layout/main-layout.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from './../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent
  ],
  template: `
    <mat-sidenav-container class="main-layout-container">
      <mat-sidenav mode="side" [opened]="sidebarOpened()" class="app-sidebar">
        <app-sidebar (toggleSidebar)="onSidebarToggle()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="main-content-area">
        <button mat-icon-button class="sidebar-collapse-btn" (click)="onSidebarToggle()">
          <mat-icon>chevron_right</mat-icon>
        </button>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .main-layout-container {
      height: 100vh;
    }
    .app-sidebar {
      width: 250px;
      background-color: #0D47A1; /* $blue-900 */
      color: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.2); /* Sombra para destacar */
    }
    .main-content-area {
      padding: 0;
      position: relative;
      /* Adicione flexbox ou grid se precisar de um layout mais complexo aqui */
    }
    .sidebar-collapse-btn {
      position: fixed;
      left: calc(250px - 25px);
      top: 50%;
      transform: translateY(-50%);
      z-index: 100;
      background-color: white;
      color: #2196f3;
      border: 1px solid #2196f3;
      transition: all 0.25s ease;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      box-shadow: 0 2px 4px rgba(33, 150, 243, 0.15);
    }
    .sidebar-collapse-btn:hover {
      color: white;
      background-color: #2196f3;
      border-color: #1976d2;
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }
    .sidebar-collapse-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpened = signal(true);
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.authService.checkAuthenticationStatus();
      });
  }

  onSidebarToggle(): void {
    this.sidebarOpened.update(v => !v);
  }
}

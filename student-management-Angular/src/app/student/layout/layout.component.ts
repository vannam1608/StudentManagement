import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  fullName: string = '';
  isDropdownOpen: boolean = false;
  unreadNotificationsCount: number = 0;
  private notificationSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fullName = localStorage.getItem('fullName') || 'Sinh viên';
    
    // Load initial notification count
    this.loadNotificationCount();
    
    // Setup periodic check for new notifications (every 30 seconds)
    this.notificationSubscription = interval(30000).subscribe(() => {
      this.loadNotificationCount();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        this.isDropdownOpen = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap dropdowns manually if needed
    if (typeof bootstrap !== 'undefined') {
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  loadNotificationCount(): void {
    this.http.get<any>('/api/notifications?Page=1&PageSize=100').subscribe({
      next: response => {
        const allNotifications = response.data || response || [];
        
        // Filter notifications for students and count unread ones
        const studentNotifications = allNotifications.filter((n: any) => {
          const target = n.targetRole?.toLowerCase();
          return target === 'student' || target === 'all';
        });
        
        // Count unread notifications (assuming they have isRead property)
        this.unreadNotificationsCount = studentNotifications.filter((n: any) => !n.isRead).length;
      },
      error: err => {
        console.error('❌ Error loading notification count:', err);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}

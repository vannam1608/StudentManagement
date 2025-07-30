import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationDto } from '../../../shared/models/notification.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: NotificationDto[] = [];
  errorMessage = '';
  private routerSub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();

    // Reload khi quay lại trang này (sau khi tạo/sửa)
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadNotifications());
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  loadNotifications(): void {
    this.notificationService.getAll().subscribe({
      next: data => this.notifications = data,
      error: err => {
        console.error('Lỗi khi load thông báo:', err);
        this.errorMessage = 'Không thể tải danh sách thông báo';
      }
    });
  }
}

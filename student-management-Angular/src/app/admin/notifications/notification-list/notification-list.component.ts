import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationDto } from '../../../shared/models/notification.model';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: NotificationDto[] = [];
  errorMessage = '';
  totalItems = 0;
  page = 1;
  pageSize = 5;

  isLoading = false;

  private routerSub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();

    // Tự động reload nếu route thay đổi
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadNotifications());
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getPaged(this.page, this.pageSize).subscribe({
      next: res => {
        console.log('📦 Dữ liệu thông báo:', res);
        this.notifications = res.data;
        this.totalItems = res.totalItems;
        this.isLoading = false;
      },
      error: err => {
        console.error('❌ Lỗi khi load thông báo:', err);
        this.errorMessage = 'Không thể tải danh sách thông báo';
        this.isLoading = false;
      }
    });
  }

  changePage(delta: number): void {
    const newPage = this.page + delta;
    const totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (newPage >= 1 && newPage <= totalPages) {
      this.page = newPage;
      this.loadNotifications();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}

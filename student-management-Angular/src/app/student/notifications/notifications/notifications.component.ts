import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading = true;
  userRole: string = '';
  selectedFilter: string = 'all';
  hasMoreNotifications: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🎓 Student Notifications Component ngOnInit');

    // Lấy role từ token để debug
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'Unknown';
        console.log('🎓 User role from token:', this.userRole);
      } catch (err) {
        console.error('❌ Error decoding token:', err);
      }
    }

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.http.get<any>('/api/notifications?Page=1&PageSize=20').subscribe({
      next: response => {
        console.log('📋 Raw API response:', response);
        
        // Kiểm tra cấu trúc response - có thể là { data: [...] } hoặc trực tiếp array
        const allNotifications = response.data || response || [];
        console.log('📋 All notifications count:', allNotifications.length);
        console.log('📋 All notifications:', allNotifications);
        
        // Chỉ lấy thông báo dành cho Student hoặc All (case insensitive)
        this.notifications = allNotifications.filter((n: any) => {
          const target = n.targetRole?.toLowerCase();
          const isForStudent = target === 'student' || target === 'all';
          console.log(`📋 Notification "${n.title}" - Target: "${n.targetRole}" (${target}) - For Student: ${isForStudent}`);
          return isForStudent;
        }).map((n: any) => ({
          ...n,
          isRead: n.isRead || false,
          isImportant: n.isImportant || false,
          isFavorite: n.isFavorite || false,
          isExpanded: false,
          type: n.type || 'info'
        }));
        
        console.log('📋 Filtered notifications for student:', this.notifications.length);
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi khi tải thông báo:', err);
        console.error('❌ Error details:', err.error);
        console.error('❌ Status:', err.status);
        console.error('❌ URL:', err.url);
        this.loading = false;
      }
    });
  }

  // Filter methods
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  getFilteredNotifications(): any[] {
    switch (this.selectedFilter) {
      case 'unread':
        return this.notifications.filter(n => !n.isRead);
      case 'important':
        return this.notifications.filter(n => n.isImportant);
      default:
        return this.notifications;
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getImportantCount(): number {
    return this.notifications.filter(n => n.isImportant).length;
  }

  // Notification actions
  markAsRead(notification: any): void {
    notification.isRead = true;
    // TODO: Call API to mark as read
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    // TODO: Call API to mark all as read
  }

  toggleFavorite(notification: any): void {
    notification.isFavorite = !notification.isFavorite;
    // TODO: Call API to update favorite status
  }

  toggleExpanded(notification: any): void {
    notification.isExpanded = !notification.isExpanded;
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }

  loadMoreNotifications(): void {
    // TODO: Implement pagination
    console.log('Load more notifications');
  }

  shareNotification(notification: any): void {
    // TODO: Implement sharing functionality
    console.log('Share notification:', notification.title);
  }

  // Utility methods
  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'student':
        return 'bg-primary';
      case 'teacher':
        return 'bg-success';
      case 'admin':
        return 'bg-danger';
      case 'all':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getRoleText(role: string): string {
    switch (role?.toLowerCase()) {
      case 'student':
        return 'Sinh viên';
      case 'teacher':
        return 'Giảng viên';
      case 'admin':
        return 'Quản trị';
      case 'all':
        return 'Tất cả';
      default:
        return role || 'Khác';
    }
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  }

  getNotificationIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'announcement':
        return 'bi bi-megaphone-fill text-primary';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-warning';
      case 'success':
        return 'bi bi-check-circle-fill text-success';
      case 'info':
        return 'bi bi-info-circle-fill text-info';
      case 'urgent':
        return 'bi bi-lightning-fill text-danger';
      default:
        return 'bi bi-bell-fill text-primary';
    }
  }

  getPreviewText(content: string): string {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }
}

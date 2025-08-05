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
        });
        
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
}

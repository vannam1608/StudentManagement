import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/notifications').subscribe({
      next: data => {
        // Chỉ lấy thông báo dành cho Student hoặc All
        this.notifications = data.filter(n =>
          n.targetRole === 'Student' || n.targetRole === 'All'
        );
        this.loading = false;
      },
      error: err => {
        console.error('Lỗi khi tải thông báo:', err);
        this.loading = false;
      }
    });
  }
}

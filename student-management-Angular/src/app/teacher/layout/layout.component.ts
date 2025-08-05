import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NgbDropdownModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  fullName: string = '...';
  notifications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🚀 LayoutComponent ngOnInit chạy');

    const token = localStorage.getItem('token'); 

    if (!token) {
      console.warn('⚠️ Không tìm thấy Token');
      this.fullName = 'Giảng viên';
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded?.nameid || decoded?.sub;
      let role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'Teacher';
      
      // Format role: Teacher, Student, etc.
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      if (!userId) {
        console.error('❌ Không có userId trong token');
        this.fullName = 'Giảng viên';
        return;
      }

      // Lấy thông tin giảng viên
      this.http.get<any>(`/api/teachers/me`).subscribe({
        next: (data) => {
          this.fullName = data.fullName;
        },
        error: (err) => {
          console.error('❌ Không thể lấy tên giảng viên:', err);
          this.fullName = 'Giảng viên';
        }
      });

      // Lấy thông báo
      this.http.get<any>('/api/notifications?Page=1&PageSize=10').subscribe({
        next: (res) => {
          const allNotis = res.data || [];

          this.notifications = allNotis.filter((n: any) => {
            const target = n.targetRole?.toLowerCase();
            return target === 'all' || target === role.toLowerCase();
          });

          console.log(`📬 Có ${this.notifications.length} thông báo hợp lệ`);
        },
        error: (err) => {
          console.error('❌ Không thể lấy thông báo:', err);
          this.notifications = [];
        }
      });

    } catch (err) {
      console.error('❌ Lỗi giải mã token:', err);
      this.fullName = 'Giảng viên';
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}

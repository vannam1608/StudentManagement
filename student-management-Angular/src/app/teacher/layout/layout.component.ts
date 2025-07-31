import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
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
      console.log('🧾 Decoded token:', decoded);
      
      // Chuẩn hóa role chữ hoa đầu
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      console.log('🎯 Vai trò hiện tại:', role);

      if (!userId) {
        console.error('❌ Không có userId trong token');
        this.fullName = 'Giảng viên';
        return;
      }

      // Gọi API lấy tên giảng viên
      this.http.get<any>(`/api/teachers/me`).subscribe({
        next: (data) => {
          this.fullName = data.fullName;
          console.log('👤 Tên giảng viên:', this.fullName);
        },
        error: (err) => {
          console.error('❌ Không thể lấy tên giảng viên:', err);
          this.fullName = 'Giảng viên';
        }
      });

      // Gọi API lấy danh sách thông báo
      this.http.get<any[]>('/api/notifications').subscribe({
        next: (data) => {
          console.log('📜 Tất cả thông báo:', data);

          this.notifications = data.filter(n => {
            const target = n.targetRole?.toLowerCase();
            const matched = target === 'all' || target === role.toLowerCase();
            console.log(`🔍 "${n.title}" | targetRole: ${n.targetRole} | matched: ${matched}`);
            return matched;
          });

          console.log('📬 Thông báo sau lọc:', this.notifications);
        },
        error: (err) => {
          console.error('❌ Không thể lấy thông báo:', err);
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

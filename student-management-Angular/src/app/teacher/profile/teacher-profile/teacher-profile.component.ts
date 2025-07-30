import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  teacher: any;
  loading = true;
  error: string | null = null; // ✅ Thêm dòng này

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Token không tồn tại');
      this.error = 'Không có token. Vui lòng đăng nhập lại.';
      this.loading = false;
      return;
    }

    this.http.get('/api/teachers/me').subscribe({
      next: (data) => {
        console.log('✅ Dữ liệu trả về:', data);
        this.teacher = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi khi gọi API:', err);
        this.error = 'Không thể tải thông tin giảng viên.';
        this.loading = false;
      }
    });
  }
}

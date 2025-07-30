import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; // Nhớ đã cài: `npm install jwt-decode`

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-classes.component.html',
  styleUrls: ['./my-classes.component.scss']
})
export class MyClassesComponent implements OnInit {
  classes: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); 

    if (!token) {
      this.error = 'Không tìm thấy token.';
      this.loading = false;
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const teacherId = decoded?.nameid;

      if (!teacherId) {
        this.error = 'Token không hợp lệ (thiếu nameid).';
        this.loading = false;
        return;
      }

      // ✅ Gọi đúng API có teacherId
      this.http.get<any[]>(`/api/CourseClass/teacher/${teacherId}`).subscribe({
        next: (data) => {
          this.classes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Lỗi khi tải lớp học:', err);
          this.error = 'Không thể tải dữ liệu lớp học.';
          this.loading = false;
        }
      });

    } catch (err) {
      console.error('❌ Lỗi giải mã token:', err);
      this.error = 'Token không hợp lệ.';
      this.loading = false;
    }
  }
}

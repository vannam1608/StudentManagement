import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // import đúng thư viện jwt-decode

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  fullName: string = '...';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.fullName = 'Giảng viên';
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded?.nameid;
      if (!userId) {
        this.fullName = 'Giảng viên';
        console.error('Không tìm thấy userId trong token');
        return;
      }

      this.http.get<any>(`/api/teachers/me`).subscribe({
        next: (data) => {
          this.fullName = data.fullName;
        },
        error: (err) => {
          console.error('❌ Không thể lấy tên giảng viên:', err);
          this.fullName = 'Giảng viên';
        }
      });
    } catch (err) {
      console.error('❌ Lỗi giải mã token:', err);
      this.fullName = 'Giảng viên';
    }
  }

  logout() {
    localStorage.clear();
    location.href = '/auth/login';
  }
}

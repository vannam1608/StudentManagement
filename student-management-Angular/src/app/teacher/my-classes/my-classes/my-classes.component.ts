import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms'; // 👈 Thêm import FormsModule để sử dụng ngModel

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // 👈 Thêm FormsModule vào imports
  templateUrl: './my-classes.component.html',
  styleUrls: ['./my-classes.component.scss']
})
export class MyClassesComponent implements OnInit {
  classes: any[] = [];
  filteredClasses: any[] = []; // 👈 Thêm mảng mới để lưu danh sách đã lọc
  loading = true;
  error: string | null = null;
  searchQuery: string = ''; // 👈 Thêm biến để lưu trữ chuỗi tìm kiếm

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

      this.http.get<any[]>(`/api/CourseClass/teacher/${teacherId}`).subscribe({
        next: (data) => {
          this.classes = data;
          this.filteredClasses = data; // 👈 Khởi tạo filteredClasses ban đầu
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

  // 👈 Thêm phương thức để lọc danh sách
  applySearchFilter(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredClasses = this.classes.filter(cls => {
      const classCodeMatch = cls.classCode?.toLowerCase().includes(query);
      const subjectNameMatch = cls.subjectName?.toLowerCase().includes(query);
      const semesterNameMatch = cls.semesterName?.toLowerCase().includes(query);
      
      return classCodeMatch || subjectNameMatch || semesterNameMatch;
    });
  }

  // Utility methods for UI
  getHeaderClass(index: number): string {
    const classes = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary'];
    return classes[index % classes.length];
  }

  getUniqueSemesters(): string[] {
    const semesters = this.classes.map(cls => cls.semesterName).filter(s => s);
    return [...new Set(semesters)];
  }

  getUniqueSubjects(): string[] {
    const subjects = this.classes.map(cls => cls.subjectName).filter(s => s);
    return [...new Set(subjects)];
  }

  getTotalStudents(): number {
    return this.classes.reduce((total, cls) => total + (cls.studentCount || 0), 0);
  }
}
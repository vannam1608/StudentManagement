import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto } from '../../../shared/models/student.model';
import { PagedResult } from '../../../shared/models/paged-result.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  students: StudentDto[] = [];
  loading = false;

  // Phân trang
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  // Tìm kiếm
  searchCode: string = ''; // Giá trị người dùng nhập
  searchQuery: string = ''; // Query dùng gọi API (giữ lại giá trị tìm kiếm)

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;

    this.studentService.getPagedStudents(
      this.currentPage,
      this.pageSize,
      this.searchQuery || undefined // Tránh gửi chuỗi rỗng
    ).subscribe({
      next: (res: PagedResult<StudentDto>) => {
        this.students = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(res.totalItems / this.pageSize); // Tính tổng số trang
        this.currentPage = res.currentPage;
        this.loading = false;
      },
      error: () => {
        this.students = [];
        this.loading = false;
      }
    });
  }

  search(): void {
    this.searchQuery = this.searchCode.trim(); // Lưu lại mã để gọi API
    this.currentPage = 1; // Reset về trang đầu tiên
    this.loadStudents();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  createStudent(): void {
    this.router.navigate(['/admin/students/create']);
  }

  viewDetail(id: number): void {
    this.router.navigate(['/admin/students', id]);
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      this.studentService.delete(id).subscribe(() => this.loadStudents());
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeacherService } from '../../../shared/services/teacher.service';
import { TeacherDto } from '../../../shared/models/teacher.model';
import { PagedResult } from '../../../shared/models/paged-result.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  teachers: TeacherDto[] = [];
  loading = false;

  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  // Tìm kiếm
  searchCode: string = '';
  searchQuery: string = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;
    this.teacherService.getPagedTeachers(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (res: PagedResult<TeacherDto>) => {
        this.teachers = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách giảng viên:', err);
        this.loading = false;
      }
    });
  }

  search() {
    this.searchQuery = this.searchCode.trim();
    this.currentPage = 1;
    this.loadTeachers();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTeachers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTeachers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTeachers();
    }
  }

  delete(id: number) {
    if (confirm('Bạn có chắc chắn muốn xoá giảng viên này?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.loadTeachers();
          alert('✅ Xoá giảng viên thành công!');
        },
        error: (err) => {
          console.error(err);
          alert('❌ Xoá giảng viên thất bại!');
        }
      });
    }
  }
}

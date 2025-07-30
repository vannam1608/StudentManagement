import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentDto } from '../../../shared/models/department.model';
import { DepartmentService } from '../../../shared/services/department.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments: DepartmentDto[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách khoa:', err);
        this.errorMessage = 'Không thể tải danh sách khoa.';
      },
    });
  }

  deleteDepartment(id: number) {
    if (!confirm('Bạn có chắc muốn xóa khoa này?')) return;

    this.departmentService.delete(id).subscribe({
      next: () => {
        this.successMessage = '✅ Đã xóa khoa thành công.';
        this.errorMessage = '';
        this.loadDepartments();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Lỗi khi xóa khoa:', err);
        this.errorMessage = '❌ Không thể xóa khoa.';
        this.successMessage = '';
      }
    });
  }
}

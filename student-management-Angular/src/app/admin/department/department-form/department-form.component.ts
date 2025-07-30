import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../shared/services/department.service';
import { CreateDepartmentDto, DepartmentDto } from '../../../shared/models/department.model';

import { Route } from '@angular/router';


@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-form.component.html'
})

export class DepartmentFormComponent implements OnInit {
  id?: number;
  model: CreateDepartmentDto = { name: '' };
  isEditMode: boolean = false;
  successMessage = '';
  errorMessage = '';

  constructor(
  private route: ActivatedRoute,
  public router: Router, // ← đổi từ private thành public
  private departmentService: DepartmentService
) {}


  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEditMode = true;
      this.departmentService.getById(this.id).subscribe({
        next: (data: DepartmentDto) => {
          this.model.name = data.name;
        },
        error: () => {
          this.errorMessage = 'Không thể tải thông tin khoa.';
        }
      });
    }
  }

  onSubmit() {
    if (!this.model.name.trim()) {
      this.errorMessage = 'Tên khoa không được để trống.';
      return;
    }

    if (this.isEditMode && this.id) {
      this.departmentService.update(this.id, this.model).subscribe({
        next: () => {
          this.successMessage = '✅ Cập nhật khoa thành công!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/admin/departments']), 1500);
        },
        error: () => {
          this.errorMessage = '❌ Lỗi khi cập nhật khoa.';
          this.successMessage = '';
        }
      });
    } else {
      this.departmentService.create(this.model).subscribe({
        next: () => {
          this.successMessage = '✅ Tạo khoa mới thành công!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/admin/departments']), 1500);
        },
        error: () => {
          this.errorMessage = '❌ Lỗi khi tạo khoa.';
          this.successMessage = '';
        }
      });
    }
  }
}

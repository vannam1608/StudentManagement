// src/app/admin/semesters/semester-list/semester-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterService } from '../../../shared/services/semester.service';
import { SemesterDto } from '../../../shared/models/semester.model';
import {  RouterLink } from '@angular/router';

@Component({
  selector: 'app-semester-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './semester-list.component.html'
})
export class SemesterListComponent implements OnInit {
  semesters: SemesterDto[] = [];
  error = '';
  isLoading = false;

  constructor(private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.semesterService.getAll().subscribe({
      next: res => {
        this.semesters = res;
        this.isLoading = false;
      },
      error: err => {
        this.error = 'Không thể tải danh sách học kỳ';
        this.isLoading = false;
      }
    });
  }

  canToggle(s: SemesterDto): boolean {
    const today = new Date();
    return new Date(s.startDate) <= today;
  }

  toggleSemester(id: number) {
    this.semesterService.toggle(id).subscribe({
      next: () => {
        alert('✅ Đã chuyển trạng thái học kỳ');
        this.loadData();
      },
      error: err => {
        alert(err.error?.message || '❌ Không thể chuyển trạng thái học kỳ (có thể chưa đến ngày học)');
      }
    });
  }
}

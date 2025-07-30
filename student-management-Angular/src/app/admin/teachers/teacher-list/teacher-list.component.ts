import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeacherService } from '../../../shared/services/teacher.service';
import { TeacherDto } from '../../../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  teachers: TeacherDto[] = [];
  loading = false;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách giảng viên:', err);
        this.loading = false;
      }
    });
  }

    delete(id: number) {
    if (confirm('Bạn có chắc chắn muốn xoá giảng viên này?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.teachers = this.teachers.filter(t => t.id !== id);
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

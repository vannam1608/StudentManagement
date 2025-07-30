import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CourseClassDto } from '../../../shared/models/course-class.model';
import { CourseClassService } from '../../../shared/services/course-class.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './class-list.component.html'
})
export class ClassListComponent implements OnInit {
  courseClasses: CourseClassDto[] = [];
  searchKeyword: string = '';
  selectedSemester: string = ''; // HK1, HK2 hoặc ''
  successMessage: string = '';

  constructor(
    private courseClassService: CourseClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.successMessage = params['message'];
        setTimeout(() => this.successMessage = '', 3000);
      }
    });

    this.loadCourseClasses();
  }

  loadCourseClasses(): void {
    this.courseClassService.getAll().subscribe({
      next: data => this.courseClasses = data,
      error: err => console.error('Lỗi tải lớp học phần:', err)
    });
  }

  viewDetail(id: number) {
    this.router.navigate(['/admin/course-classes/detail', id]);
  }

  editClass(id: number) {
    this.router.navigate(['/admin/course-classes/edit', id]);
  }

  createClass() {
    this.router.navigate(['/admin/course-classes/create']);
  }

  filterClasses(): CourseClassDto[] {
    let filtered = this.courseClasses;

    if (this.selectedSemester) {
      filtered = filtered.filter(c =>
        c.semesterName?.toLowerCase().includes(this.selectedSemester.toLowerCase())
      );
    }

    if (this.searchKeyword.trim()) {
      filtered = filtered.filter(c =>
        c.classCode.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        c.subjectName.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }

    return filtered;
  }

  deleteClass(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa lớp học phần này không?')) {
      this.courseClassService.delete(id).subscribe({
        next: () => {
          alert('✅ Xóa thành công!');
          this.loadCourseClasses();
        },
        error: (err) => {
          console.error('❌ Lỗi khi xóa lớp học phần:', err);
          alert('❌ Xóa thất bại!');
        }
      });
    }
  }
}

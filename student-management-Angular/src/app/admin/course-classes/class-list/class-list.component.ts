import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseClassDto } from '../../../shared/models/course-class.model';
import { CourseClassService } from '../../../shared/services/course-class.service';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './class-list.component.html'
})
export class ClassListComponent implements OnInit {
  allCourseClasses: CourseClassDto[] = []; // Toàn bộ dữ liệu (không phân trang)
  courseClasses: CourseClassDto[] = []; // Dữ liệu hiển thị trên giao diện (theo trang)
  searchKeyword: string = '';
  selectedSemester: string = ''; 
  successMessage: string = '';
  availableSemesters: string[] = [];

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private courseClassService: CourseClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['message']) {
        this.successMessage = params['message'];
        setTimeout(() => this.successMessage = '', 3000);
      }
    });

    this.loadCourseClasses();
  }

  loadCourseClasses(): void {
    this.courseClassService.getPaged(1, 1000).subscribe({
      next: res => {
        this.allCourseClasses = res.data;
        this.extractAvailableSemesters();
        this.updateFilteredData();
      },
      error: err => console.error('Lỗi tải lớp học phần:', err)
    });
  }

  extractAvailableSemesters(): void {
    const allSemesters = this.allCourseClasses
      .map(c => c.semesterName)
      .filter(s => s && s.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index);

    this.availableSemesters = allSemesters.sort();
  }

  updateFilteredData(): void {
    let filtered = this.allCourseClasses;

    if (this.selectedSemester) {
      filtered = filtered.filter(c => c.semesterName === this.selectedSemester);
    }

    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(c =>
        c.classCode.toLowerCase().includes(keyword) ||
        c.subjectName.toLowerCase().includes(keyword)
      );
    }

    this.totalItems = filtered.length;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.courseClasses = filtered.slice(start, end);
  }

  filterClasses(): void {
    this.currentPage = 1;
    this.updateFilteredData();
  }

  nextPage(): void {
    this.currentPage++;
    this.updateFilteredData();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredData();
    }
  }

  viewDetail(id: number): void {
    this.router.navigate(['/admin/course-classes/detail', id]);
  }

  editClass(id: number): void {
    this.router.navigate(['/admin/course-classes/edit', id]);
  }

  createClass(): void {
    this.router.navigate(['/admin/course-classes/create']);
  }

  deleteClass(id: number): void {
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { StudentService } from '../../../shared/services/student.service';
import { SemesterService } from '../../../shared/services/semester.service';
import { EnrollmentDto } from '../../../shared/models/enrollment.model';
import { StudentDto } from '../../../shared/models/student.model';
import { SemesterDto } from '../../../shared/models/semester.model';
import { PagedResult } from '../../../shared/models/paged-result.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-list.component.html'
})
export class EnrollmentListComponent implements OnInit, OnDestroy {
  enrollments: EnrollmentDto[] = [];
  students: StudentDto[] = [];
  semesters: SemesterDto[] = [];

  studentCodeFilter = '';
  subjectNameFilter = '';
  selectedSemesterId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadSemesters();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private loadStudents(): void {
    this.studentService.getPagedStudents(1, 1000).subscribe({
      next: (result) => (this.students = result.data ?? []),
      error: (err) => console.error('❌ Lỗi tải sinh viên:', err)
    });
  }

  private loadSemesters(): void {
    this.semesterService.getAllSemesters().subscribe({
      next: (data) => {
        this.semesters = data ?? [];
        this.selectedSemesterId = this.getActiveSemesterId(this.semesters);
        this.loadEnrollments();
      },
      error: (err) => console.error('❌ Lỗi tải học kỳ:', err)
    });
  }

  private getActiveSemesterId(semesters: SemesterDto[]): number | null {
    const today = new Date();
    const activeSemester = semesters.find(s => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return start <= today && today <= end;
    });
    return activeSemester?.id ?? null;
  }

  loadEnrollments(): void {
    if (!this.selectedSemesterId) {
      this.enrollments = [];
      this.totalPages = 0;
      return;
    }

    this.enrollmentService
      .searchEnrollments(
        this.currentPage,
        this.pageSize,
        this.selectedSemesterId,
        this.studentCodeFilter.trim() || undefined,
        this.subjectNameFilter.trim() || undefined
      )
      .subscribe({
        next: (result) => {
          this.enrollments = result.data ?? [];
          this.totalPages = result.totalPages ?? 1;
        },
        error: (err) => console.error('❌ Lỗi tải danh sách đăng ký:', err)
      });
  }

  delete(id: number): void {
    if (confirm('Bạn có chắc muốn xoá đăng ký này?')) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => this.loadEnrollments(),
        error: (err) => console.error('❌ Xoá thất bại:', err)
      });
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEnrollments();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEnrollments();
    }
  }

  onSemesterChange(): void {
    this.currentPage = 1;
    this.loadEnrollments();
  }

  onStudentCodeChange(): void {
    this.debounceLoadEnrollments();
  }

  onSubjectNameChange(): void {
    this.debounceLoadEnrollments();
  }

  private debounceLoadEnrollments(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadEnrollments();
    }, 500);
  }

  trackById(index: number, item: EnrollmentDto): number {
    return item.id;
  }
}

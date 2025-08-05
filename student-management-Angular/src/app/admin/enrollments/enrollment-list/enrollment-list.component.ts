import { Component, OnInit } from '@angular/core';
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
export class EnrollmentListComponent implements OnInit {
  enrollments: EnrollmentDto[] = [];
  students: StudentDto[] = [];
  semesters: SemesterDto[] = [];

  selectedStudentId: string | null = null; // Đổi thành string để chứa studentCode
  selectedSemesterId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadSemesters();
    this.loadEnrollments();
  }

  loadStudents(): void {
    this.studentService.getPagedStudents(1, 1000).subscribe({
      next: (result) => this.students = result.data ?? [],
      error: (err) => console.error('❌ Lỗi tải sinh viên:', err)
    });
  }

  loadSemesters(): void {
    this.semesterService.getAllSemesters().subscribe({
      next: (data) => this.semesters = data ?? [],
      error: (err) => console.error('❌ Lỗi tải học kỳ:', err)
    });
  }

  loadEnrollments(): void {
  console.log('▶️ Load Enrollments:', {
    studentCode: this.selectedStudentId,
    semesterId: this.selectedSemesterId,
    page: this.currentPage,
    pageSize: this.pageSize
  });

  if (this.selectedStudentId != null) {
    // 🔍 Tìm studentId từ mã sinh viên (studentCode)
    const selectedStudent = this.students.find(s => s.studentCode === this.selectedStudentId);
    const selectedStudentId = selectedStudent?.id;

    console.log('🔍 Selected student:', selectedStudent);
    console.log('🔍 Selected student ID:', selectedStudentId);

    if (!selectedStudentId) {
      console.warn('❌ Không tìm thấy studentId từ studentCode:', this.selectedStudentId);
      console.log('📋 Available students:', this.students.map(s => ({ id: s.id, code: s.studentCode, name: s.fullName })));
      this.enrollments = [];
      this.totalPages = 1;
      return;
    }

    this.enrollmentService.getEnrollmentsByStudent(selectedStudentId).subscribe({
      next: (data) => {
        let filtered = data ?? [];

        if (this.selectedSemesterId != null) {
          const selectedSemester = this.semesters.find(s => s.id === this.selectedSemesterId);
          const selectedSemesterName = selectedSemester?.name;
          if (selectedSemesterName) {
            filtered = filtered.filter(e => e.semesterName === selectedSemesterName);
          }
        }

        // ✅ Phân trang thủ công
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.enrollments = filtered.slice(start, end);
        this.totalPages = Math.max(Math.ceil(filtered.length / this.pageSize), 1);
      },
      error: (err) => console.error('❌ Lỗi tải theo studentCode:', err)
    });
  } else {
    // ❗ Nếu không chọn sinh viên → Gọi API phân trang mặc định
    this.enrollmentService.getPagedEnrollments(
      this.currentPage,
      this.pageSize,
      this.selectedSemesterId ?? undefined
    ).subscribe({
      next: (result: PagedResult<EnrollmentDto>) => {
        this.enrollments = result.data ?? [];
        const totalItems = result.totalItems ?? 0;
        this.totalPages = Math.max(Math.ceil(totalItems / this.pageSize), 1);
      },
      error: (err) => console.error('❌ Lỗi tải enrollment:', err)
    });
  }
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

  onStudentChange(): void {
    this.currentPage = 1;
    this.loadEnrollments();
  }

  // ✅ Dùng để track phần tử cho *ngFor
  trackById(index: number, item: EnrollmentDto): number {
    return item.id;
  }
}

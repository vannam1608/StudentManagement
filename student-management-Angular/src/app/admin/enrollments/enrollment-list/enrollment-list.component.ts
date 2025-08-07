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

  studentCodeFilter: string = ''; // Thay đổi từ selectedStudentId thành studentCodeFilter
  selectedSemesterId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  private searchTimeout: any; // Để debounce tìm kiếm

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
      studentCode: this.studentCodeFilter,
      semesterId: this.selectedSemesterId,
      page: this.currentPage,
      pageSize: this.pageSize
    });

    // Nếu có nhập mã sinh viên
    if (this.studentCodeFilter && this.studentCodeFilter.trim() !== '') {
      const studentCodeTrimmed = this.studentCodeFilter.trim();
      
      // 🔍 Tìm studentId từ mã sinh viên (studentCode)
      const selectedStudent = this.students.find(s => 
        s.studentCode.toLowerCase().includes(studentCodeTrimmed.toLowerCase())
      );
      
      if (!selectedStudent) {
        console.warn('❌ Không tìm thấy sinh viên với mã:', studentCodeTrimmed);
        this.enrollments = [];
        this.totalPages = 1;
        return;
      }

      this.enrollmentService.getEnrollmentsByStudent(selectedStudent.id).subscribe({
        next: (data) => {
          let filtered = data ?? [];

          // Lọc theo semester nếu có chọn
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
      // ❗ Nếu không nhập mã sinh viên → Gọi API phân trang mặc định
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

  onStudentCodeChange(): void {
    // Debounce để tránh gọi API quá nhiều khi user đang gõ
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadEnrollments();
    }, 500); // Delay 500ms
  }

  // ✅ Dùng để track phần tử cho *ngFor
  trackById(index: number, item: EnrollmentDto): number {
    return item.id;
  }
}

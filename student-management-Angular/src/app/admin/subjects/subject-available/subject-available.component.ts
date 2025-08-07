import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SubjectService } from '../../../shared/services/subject.service';
import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { StudentService } from '../../../shared/services/student.service';
import { SemesterService } from '../../../shared/services/semester.service';

import { SubjectDto } from '../../../shared/models/subject.model';
import { StudentDto } from '../../../shared/models/student.model';
import { SemesterDto } from '../../../shared/models/semester.model';

@Component({
  selector: 'app-subject-available',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './subject-available.component.html'
})
export class SubjectAvailableComponent implements OnInit {
  availableSubjects: SubjectDto[] = [];
  enrolledSubjects: any[] = [];
  semesters: SemesterDto[] = [];
  students: StudentDto[] = [];
  filteredStudents: StudentDto[] = [];

  selectedSemesterId: number = 0;
  selectedStudentId?: number;
  studentSearchTerm: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private subjectService: SubjectService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private semesterService: SemesterService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadSemesters();
    this.loadStudents();
  }

  goBack() {
    this.location.back();
  }

  loadSemesters() {
    this.semesterService.getAllSemesters().subscribe({
      next: (data) => {
        this.semesters = data;
        const openSemester = this.semesters.find(s => s.isOpen);
        this.selectedSemesterId = openSemester?.id || this.semesters[0]?.id || 0;
        this.checkAndLoadSubjects();
      },
      error: () => {
        this.errorMessage = 'Không thể tải danh sách học kỳ.';
      }
    });
  }

  loadStudents() {
    this.studentService.getPagedStudents(1, 100).subscribe({
      next: (res) => {
        this.students = res.data;
        this.filteredStudents = this.students;
        this.selectedStudentId = this.students[0]?.id;
        this.checkAndLoadSubjects();
      },
      error: () => {
        this.errorMessage = 'Không thể tải danh sách sinh viên.';
      }
    });
  }

  onSearchStudent() {
    if (!this.studentSearchTerm.trim()) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.studentCode.toLowerCase().includes(this.studentSearchTerm.toLowerCase()) ||
        student.fullName.toLowerCase().includes(this.studentSearchTerm.toLowerCase())
      );
    }
    
    // Reset selected student if not in filtered list
    if (this.selectedStudentId && !this.filteredStudents.find(s => s.id === this.selectedStudentId)) {
      this.selectedStudentId = this.filteredStudents[0]?.id;
      this.checkAndLoadSubjects();
    }
  }

  checkAndLoadSubjects() {
    if (this.selectedSemesterId && this.selectedStudentId) {
      this.loadSubjects();
    }
  }

  onStudentOrSemesterChange() {
    this.checkAndLoadSubjects();
  }

  async loadSubjects() {
    try {
      await this.loadEnrolledSubjects();
      await this.loadAvailableSubjects();
    } catch {
      // lỗi riêng đã xử lý
    }
  }

  loadEnrolledSubjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.selectedStudentId) return resolve();

      this.enrollmentService.getEnrollmentsByStudent(this.selectedStudentId, this.selectedSemesterId).subscribe({
        next: (data) => {
          this.enrolledSubjects = data.map((e: any) => ({
            ...e,
            subjectCode: e.subjectCode
          }));
          resolve();
        },
        error: (err) => {
          console.error('Lỗi tải môn học đã đăng ký:', err);
          this.errorMessage = 'Không thể tải danh sách môn học đã đăng ký.';
          this.enrolledSubjects = [];
          reject();
        }
      });
    });
  }

  loadAvailableSubjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subjectService.getAvailableSubjects(this.selectedSemesterId).subscribe({
        next: (data) => {
          const enrolledCodes = this.enrolledSubjects.map(e => e.subjectCode);
          this.availableSubjects = data.filter(subject => !enrolledCodes.includes(subject.subjectCode));
          resolve();
        },
        error: (err) => {
          console.error('Lỗi tải môn học khả dụng:', err);
          this.errorMessage = 'Không thể tải danh sách môn học khả dụng.';
          this.availableSubjects = [];
          reject();
        }
      });
    });
  }

  registerSubject(subjectId: number) {
    if (!this.selectedStudentId) {
      this.errorMessage = 'Vui lòng chọn sinh viên.';
      return;
    }

    this.enrollmentService.registerSubject(this.selectedStudentId, subjectId).subscribe({
      next: () => {
        this.successMessage = '✅ Đăng ký môn học thành công!';
        this.errorMessage = '';
        this.loadSubjects();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Lỗi đăng ký:', err);
        this.errorMessage = err.error?.message || '❌ Đăng ký thất bại.';
        this.successMessage = '';
      }
    });
  }

  cancelEnrollment(enrollmentId: number) {
    if (!confirm('Bạn có chắc muốn hủy đăng ký môn học này?')) return;

    this.enrollmentService.deleteEnrollment(enrollmentId).subscribe({
      next: () => {
        this.successMessage = '✅ Hủy đăng ký thành công!';
        this.errorMessage = '';
        this.loadSubjects();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Lỗi hủy đăng ký:', err);
        this.errorMessage = err.error?.message || '❌ Hủy đăng ký thất bại.';
        this.successMessage = '';
      }
    });
  }

  isSemesterOpen(): boolean {
    const semester = this.semesters.find(s => s.id === this.selectedSemesterId);
    return semester?.isOpen ?? false;
  }

  hasEnrolled(subjectId: number): boolean {
    return this.enrolledSubjects.some(e => e.subjectId === subjectId);
  }
}

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

  selectedSemesterId: number = 0;
  selectedStudentId?: number;

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
        if (openSemester) {
          this.selectedSemesterId = openSemester.id;
        } else if (this.semesters.length > 0) {
          this.selectedSemesterId = this.semesters[0].id;
        }
        this.loadSubjects();
      },
      error: () => {
        this.errorMessage = 'Không thể tải danh sách học kỳ.';
      }
    });
  }

  loadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        if (this.students.length > 0) {
          this.selectedStudentId = this.students[0].id;
          this.loadSubjects();
        }
      },
      error: () => {
        this.errorMessage = 'Không thể tải danh sách sinh viên.';
      }
    });
  }

  onStudentOrSemesterChange() {
    this.loadSubjects();
  }

  async loadSubjects() {
    try {
      await this.loadEnrolledSubjects(); // cần chạy trước để có enrolledSubjects
      await this.loadAvailableSubjects(); // rồi mới lọc những môn chưa đăng ký
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
        error: () => {
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
        error: () => {
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

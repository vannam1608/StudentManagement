import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { StudentService } from '../../../shared/services/student.service';
import { SemesterService } from '../../../shared/services/semester.service';
import { EnrollmentDto } from '../../../shared/models/enrollment.model';
import { StudentDto } from '../../../shared/models/student.model';
import { SemesterDto } from '../../../shared/models/semester.model';

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

  selectedStudentId: number | null = null;
  selectedSemesterId: number | null = null;

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
    this.studentService.getAllStudents().subscribe({
      next: (data) => this.students = data,
      error: (err) => console.error('❌ Lỗi tải sinh viên:', err)
    });
  }

  loadSemesters(): void {
    this.semesterService.getAllSemesters().subscribe({
      next: (data) => this.semesters = data,
      error: (err) => console.error('Lỗi tải học kỳ:', err)
    });
  }

  loadEnrollments(): void {
  console.log('▶️ Load Enrollments với:', {
    studentId: this.selectedStudentId,
    semesterId: this.selectedSemesterId
  });

  if (this.selectedStudentId != null) {
    this.enrollmentService.getEnrollmentsByStudent(
      this.selectedStudentId,
      this.selectedSemesterId ?? undefined
    ).subscribe({
      next: (data) => {
        console.log('✅ Dữ liệu trả về:', data);
        this.enrollments = data;
      },
      error: (err) => console.error('❌ Lỗi tải theo sinh viên:', err)
    });
  } else {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        console.log('✅ Tải toàn bộ:', data);
        this.enrollments = this.selectedSemesterId
          ? data.filter(e => e.semesterName.includes(this.getSemesterName(this.selectedSemesterId!)))
          : data;
      },
      error: (err) => console.error('Lỗi tải toàn bộ enrollment:', err)
    });
  }
}


  getSemesterName(id: number): string {
    return this.semesters.find(s => s.id === id)?.name || '';
  }

  delete(id: number): void {
    if (confirm('Bạn có chắc muốn xoá đăng ký này?')) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => this.loadEnrollments(),
        error: (err) => console.error('Xoá thất bại:', err)
      });
    }
  }
}

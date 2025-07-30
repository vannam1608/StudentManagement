// src/app/admin/students/student-list/student-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto } from '../../../shared/models/student.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  students: StudentDto[] = [];

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAll().subscribe(data => {
      this.students = data;
    });
  }

  createStudent() {
    this.router.navigate(['/admin/students/create']);
  }

  viewDetail(id: number) {
    this.router.navigate(['/admin/students', id]);
  }

  editStudent(id: number) {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      this.studentService.delete(id).subscribe(() => {
        this.loadStudents(); 
      });
    }
  }
}
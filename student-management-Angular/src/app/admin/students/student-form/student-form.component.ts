// src/app/admin/students/student-form/student-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../shared/services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../../../shared/models/student.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Thêm dòng này

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule // ✅ Bổ sung để routerLink hoạt động
  ],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  studentId?: number;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      studentCode: ['', Validators.required],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      gender: ['Nam', Validators.required],
      dateOfBirth: ['', Validators.required],
      departmentId: [1, Validators.required],
      programId: [1, Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.studentId = +idParam;
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number) {
  this.studentService.getById(id).subscribe((student) => {
    this.form.patchValue({
      studentCode: student.studentCode,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,   
    });

    this.form.get('username')?.disable(); // chỉ hiển thị
    this.form.get('password')?.disable(); // không sửa mật khẩu ở đây
  });
}


  onSubmit() {
  if (this.form.invalid) return;

  const dto = this.form.getRawValue();

  if (this.isEdit && this.studentId) {
    const updateDto: UpdateStudentDto = dto;
    this.studentService.update(this.studentId, updateDto).subscribe({
      next: (res) => {
        alert('✅ Cập nhật thành công');
        this.router.navigate(['/admin/students']);
      },
      error: (err) => {
        console.error('❌ Lỗi cập nhật:', err);
        alert('❌ Cập nhật thất bại');
      }
    });
  } else {
    const createDto: CreateStudentDto = dto;
    this.studentService.create(createDto).subscribe({
      next: () => {
        alert('✅ Tạo mới thành công');
        this.router.navigate(['/admin/students']);
      },
      error: (err) => {
        console.error('❌ Lỗi tạo mới:', err);
        alert('❌ Tạo mới thất bại');
      }
    });
  }
}

}

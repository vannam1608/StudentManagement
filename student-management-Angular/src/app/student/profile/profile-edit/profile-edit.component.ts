import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto, UpdateStudentDto } from '../../../shared/models/student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  student?: StudentDto;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentService.getProfile().subscribe({
      next: (student: StudentDto) => {
        this.student = student;

        this.form = this.fb.group({
          fullName: [student.fullName, Validators.required],
          email: [student.email, [Validators.required, Validators.email]],
          phone: [student.phone, Validators.required],
          gender: [student.gender, Validators.required],
          dateOfBirth: [student.dateOfBirth, Validators.required]
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải hồ sơ sinh viên:', err);
        alert(`Không thể tải hồ sơ sinh viên: ${err.message || 'Lỗi không xác định'}`);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.student) return;

    const dto: UpdateStudentDto = {
      ...this.form.value,     
    };

    this.studentService.updateProfile(dto).subscribe({
      next: () => {
        alert('✅ Cập nhật thành công');
        localStorage.setItem('fullName', this.form.value.fullName); // nếu dùng trong layout
        this.router.navigate(['/student/profile']);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật', err);
        alert('❌ Cập nhật thất bại');
      }
    });
  }
}

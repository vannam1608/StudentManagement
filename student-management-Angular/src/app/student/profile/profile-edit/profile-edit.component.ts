import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto, UpdateStudentDto } from '../../../shared/models/student.model';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  student?: StudentDto;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentService.getProfile().subscribe({
      next: (data) => {
        this.student = data;
        this.form = this.fb.group({
          fullName: [data.fullName, [Validators.required]],
          email: [data.email, [Validators.required, Validators.email]],
          gender: [data.gender],
          dateOfBirth: [new Date(data.dateOfBirth).toISOString().split('T')[0]],
          phone: [data.phone]
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi tải thông tin sinh viên:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.student) return;

    this.saving = true;

    const updatedStudent: UpdateStudentDto = {
      studentCode: this.student.studentCode,
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      gender: this.form.value.gender,
      dateOfBirth: new Date(this.form.value.dateOfBirth).toISOString(),
      departmentId: this.student.departmentId ?? 1,
      programId: this.student.programId ?? 2
    };

    console.log('📦 Dữ liệu gửi lên:', JSON.stringify(updatedStudent, null, 2));

    this.studentService.updateProfile(updatedStudent).subscribe({
      next: () => {
        this.router.navigate(['/student/user-info'], {
          state: { updated: true }
        });
        this.saving = false;
      },
      error: (err) => {
        console.error('❌ Lỗi cập nhật thông tin:', err);
        console.log('Chi tiết lỗi:', err.error);
        this.saving = false;
      }
    });
  }

  // ✅ Reset form to original values
  resetForm(): void {
    if (this.student) {
      this.form.patchValue({
        fullName: this.student.fullName,
        email: this.student.email,
        gender: this.student.gender,
        dateOfBirth: new Date(this.student.dateOfBirth).toISOString().split('T')[0],
        phone: this.student.phone
      });
      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
  }

}

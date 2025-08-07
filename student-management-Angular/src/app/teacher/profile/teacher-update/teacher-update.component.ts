import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-update.component.html',
  styleUrls: ['./teacher-update.component.scss']
})
export class TeacherUpdateComponent implements OnInit {
  form!: FormGroup;
  teacherId!: number;
  loading = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      degree: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.http.get<any>('/api/teachers/me').subscribe({
      next: (data) => {
        this.teacherId = data.id;
        this.form.patchValue({
          fullName: data.fullName,
          degree: data.degree,
          email: data.email,
          phone: data.phone
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi tải dữ liệu giảng viên:', err);
        this.error = 'Không thể tải dữ liệu giảng viên.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.http.put(`/api/teachers/${this.teacherId}`, this.form.value).subscribe({
      next: () => {
        alert('✅ Cập nhật thành công!');
        this.router.navigate(['/teacher/profile']);
      },
      error: (err) => {
        console.error('❌ Cập nhật thất bại:', err);
        this.error = 'Cập nhật thất bại.';
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  form: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid || this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.errorMessage = 'Xác nhận mật khẩu không khớp.';
      return;
    }

    const request = {
      currentPassword: this.form.value.currentPassword,
      newPassword: this.form.value.newPassword
    };

    this.http.post('/api/auth/change-password', request).subscribe({
      next: (res: any) => {
        this.successMessage = 'Đổi mật khẩu thành công!';
        this.errorMessage = '';
        this.form.reset();
      },
      error: err => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra!';
      }
    });
  }
}

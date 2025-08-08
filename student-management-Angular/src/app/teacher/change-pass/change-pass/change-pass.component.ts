import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent {
  changeForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.changeForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.changeForm.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ và hợp lệ.';
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.changeForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Mật khẩu mới không khớp.';
      return;
    }

    this.isSubmitting = true;

    this.http.post('https://localhost:7172/api/Auth/change-password', {
      oldPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Đổi mật khẩu thành công!';
        this.changeForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Đổi mật khẩu thất bại.';
        this.isSubmitting = false;
      }
    });
  }
}

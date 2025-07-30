import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        const role = this.authService.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Teacher') {
          this.router.navigate(['/teacher']);
        } else if (role === 'Student') {
          this.router.navigate(['/student']);
        } else {
          this.errorMessage = 'Vai trò không xác định.';
        }
      },
      error: () => {
        this.errorMessage = 'Tài khoản hoặc mật khẩu không đúng.';
      },
    });
  }
}

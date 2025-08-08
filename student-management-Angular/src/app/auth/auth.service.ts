import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7172/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('fullName', response.fullName);
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): number {
  const token = this.getToken();
  if (!token) return 0;

  try {
    const payloadBase64Url = token.split('.')[1];

    // ✅ Chuyển từ base64url → base64 đúng chuẩn
    const payloadBase64 = payloadBase64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payloadBase64Url.length + (4 - payloadBase64Url.length % 4) % 4, '=');

    const decodedPayload = JSON.parse(atob(payloadBase64));
    return Number(decodedPayload?.studentId ?? decodedPayload?.nameid ?? decodedPayload?.sub ?? 0);
  } catch (err) {
    console.error('❌ Lỗi giải mã token:', err);
    return 0;
  }
}


  getCurrentUser(): { fullName: string; role: string } | null {
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    if (fullName && role) {
      return { fullName, role };
    }
    return null;
  }
}

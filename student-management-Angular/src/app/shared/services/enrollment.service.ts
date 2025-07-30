import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentDto } from '../models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private userApi = 'https://localhost:7172/api/users';
  private enrollApi = 'https://localhost:7172/api/enrollments';

  constructor(private http: HttpClient) {}

  /**
   * 📝 Đăng ký môn học cho sinh viên
   * POST /api/users/students/{studentId}/register
   */
  registerSubject(studentId: number, courseClassId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.userApi}/students/${studentId}/register`,
      { courseClassId }
    );
  }

  /**
   * 📚 Lấy danh sách đăng ký học phần của sinh viên
   * GET /api/enrollments/student/{studentId}?semesterId=...
   */
  getEnrollmentsByStudent(studentId: number, semesterId?: number): Observable<EnrollmentDto[]> {
    let url = `${this.enrollApi}/student/${studentId}`;
    if (semesterId != null) {
      url += `?semesterId=${semesterId}`;
    }
    return this.http.get<EnrollmentDto[]>(url);
  }

  /**
   * 📋 Lấy tất cả đăng ký học phần
   * GET /api/enrollments
   */
  getAllEnrollments(): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(this.enrollApi);
  }

  /**
   * 🗑️ Xoá đăng ký học phần
   * DELETE /api/enrollments/{id}
   */
  deleteEnrollment(enrollmentId: number): Observable<string> {
  return this.http.delete(`${this.enrollApi}/${enrollmentId}`, {
    responseType: 'text'
  }) as unknown as Observable<string>;
}

}

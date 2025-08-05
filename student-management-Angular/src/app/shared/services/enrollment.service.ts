import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentDto } from '../models/enrollment.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly userApi = 'https://localhost:7172/api/users';
  private readonly enrollApi = 'https://localhost:7172/api/enrollments';

  constructor(private http: HttpClient) {}

  /**
   * 📝 Đăng ký môn học cho sinh viên
   * POST /api/users/students/{studentId}/register
   */
  registerSubject(studentId: number, courseClassId: number): Observable<{ message: string }> {
    const url = `${this.userApi}/students/${studentId}/register`;
    return this.http.post<{ message: string }>(url, { courseClassId });
  }

  /**
   * 📚 Lấy danh sách đăng ký học phần của sinh viên
   * GET /api/enrollments/student/{studentId}?semesterId=...
   */
  getEnrollmentsByStudent(studentId: number, semesterId?: number): Observable<EnrollmentDto[]> {
    const url = `${this.enrollApi}/student/${studentId}`;
    const params = semesterId != null
      ? new HttpParams().set('semesterId', semesterId.toString())
      : undefined;

    return this.http.get<EnrollmentDto[]>(url, { params });
  }

  /**
   * 📋 Lấy tất cả đăng ký học phần có phân trang
   * GET /api/enrollments/paged?page=1&pageSize=10&semesterId=...
   */
  getPagedEnrollments(
    page: number,
    pageSize: number,
    semesterId?: number
  ): Observable<PagedResult<EnrollmentDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (semesterId != null) {
      params = params.set('semesterId', semesterId.toString());
    }

    return this.http.get<PagedResult<EnrollmentDto>>(`${this.enrollApi}/paged`, { params });
  }

  /**
   * 🗑️ Xoá đăng ký học phần
   * DELETE /api/enrollments/{enrollmentId}
   */
  deleteEnrollment(enrollmentId: number): Observable<string> {
    const url = `${this.enrollApi}/${enrollmentId}`;
    return this.http.delete(url, { responseType: 'text' }) as Observable<string>;
  }
}

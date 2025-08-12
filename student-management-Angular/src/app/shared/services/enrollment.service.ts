import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentDto } from '../models/enrollment.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly baseUrl = 'https://localhost:7172/api/enrollments';
  private readonly userApi = 'https://localhost:7172/api/users';

  constructor(private http: HttpClient) {}

  /** 📝 Đăng ký môn học cho sinh viên */
  registerSubject(studentId: number, courseClassId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.userApi}/students/${studentId}/register`,
      { courseClassId }
    );
  }

  /** 📚 Lấy danh sách đăng ký học phần của sinh viên (có thể lọc theo học kỳ) */
  getEnrollmentsByStudent(studentId: number, semesterId?: number): Observable<EnrollmentDto[]> {
    let params = new HttpParams();
    if (semesterId != null) {
      params = params.set('semesterId', semesterId.toString());
    }
    return this.http.get<EnrollmentDto[]>(`${this.baseUrl}/student/${studentId}`, { params });
  }

  /** 📚 Lấy danh sách đăng ký học phần theo học kỳ (tất cả sinh viên) */
  getEnrollmentsBySemester(semesterId: number): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(`${this.baseUrl}/semester/${semesterId}`);
  }

  /** 📋 Tìm kiếm + phân trang */
  searchEnrollments(
    page: number,
    pageSize: number,
    semesterId?: number,
    studentCode?: string,
    subjectName?: string
  ): Observable<PagedResult<EnrollmentDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (semesterId != null) {
      params = params.set('semesterId', semesterId.toString());
    }
    if (studentCode?.trim()) {
      params = params.set('studentCode', studentCode.trim());
    }
    if (subjectName?.trim()) {
      params = params.set('subjectName', subjectName.trim());
    }

    return this.http.get<PagedResult<EnrollmentDto>>(`${this.baseUrl}/search`, { params });
  }

  /** 🗑️ Xoá đăng ký học phần */
  deleteEnrollment(enrollmentId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${enrollmentId}`, { responseType: 'text' }) as Observable<string>;
  }
}

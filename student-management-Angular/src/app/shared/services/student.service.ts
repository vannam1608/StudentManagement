import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  // ✅ URL dành cho admin (quản lý sinh viên)
  private adminApiUrl = 'https://localhost:7172/api/users/students';

  // ✅ URL dùng cho phân trang (định nghĩa riêng nếu backend tách controller)
  private pagedApiUrl = 'https://localhost:7172/api/student/students';

  // ✅ URL dành cho chính sinh viên (tự xem/sửa thông tin cá nhân)
  private selfApiUrl = 'https://localhost:7172/api/student';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Phân trang danh sách sinh viên cho admin (có hỗ trợ tìm kiếm theo mã sinh viên)
   * @param page Trang hiện tại
   * @param pageSize Số lượng mỗi trang
   * @param studentCode (optional) Mã sinh viên để tìm kiếm
   */
  getPagedStudents(page: number, pageSize: number, studentCode?: string): Observable<PagedResult<StudentDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (studentCode && studentCode.trim() !== '') {
      params = params.set('studentCode', studentCode.trim());
    }

    return this.http.get<PagedResult<StudentDto>>(`${this.pagedApiUrl}/paged`, { params });
  }

  // ✅ Lấy sinh viên theo ID (admin)
  getById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.adminApiUrl}/${id}`);
  }

  // ✅ Thêm sinh viên (admin)
  create(dto: CreateStudentDto): Observable<any> {
    return this.http.post(this.adminApiUrl, dto);
  }

  // ✅ Sửa thông tin sinh viên (admin)
  update(id: number, dto: UpdateStudentDto): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}`, dto);
  }

  // ✅ Xoá sinh viên (admin)
  delete(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7172/api/users/${id}`);
  }

  // ✅ Sinh viên lấy thông tin của chính mình
  getProfile(): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.selfApiUrl}/me`);
  }

  // ✅ Sinh viên cập nhật thông tin cá nhân
  updateProfile(dto: UpdateStudentDto): Observable<any> {
    return this.http.put(`${this.selfApiUrl}/me`, dto);
  }
}

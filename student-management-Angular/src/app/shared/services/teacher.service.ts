import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherDto, CreateTeacherDto } from '../models/teacher.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = 'https://localhost:7172/api/teachers';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Phân trang danh sách giảng viên (có hỗ trợ tìm kiếm theo mã)
   * @param page Trang hiện tại
   * @param pageSize Số lượng mỗi trang
   * @param teacherCode (optional) Mã giảng viên để tìm kiếm
   */
  getPagedTeachers(page: number, pageSize: number, teacherCode?: string): Observable<PagedResult<TeacherDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (teacherCode && teacherCode.trim() !== '') {
      params = params.set('teacherCode', teacherCode.trim());
    }

    return this.http.get<PagedResult<TeacherDto>>(`${this.apiUrl}/paged`, { params });
  }

  getById(id: number): Observable<TeacherDto> {
    return this.http.get<TeacherDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTeacherDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: Partial<CreateTeacherDto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

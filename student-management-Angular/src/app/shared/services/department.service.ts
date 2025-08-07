import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DepartmentDto, CreateDepartmentDto } from '../models/department.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'https://localhost:7172/api/departments';

  constructor(private http: HttpClient) {}

  // ✅ Lấy tất cả khoa
  getAll(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(this.apiUrl);
  }

  // ✅ Lấy khoa theo ID
  getById(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.apiUrl}/${id}`);
  }

  // ✅ Tạo khoa (trả về message)
  create(dto: CreateDepartmentDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, dto);
  }

  // ✅ Cập nhật khoa (trả về message)
  update(id: number, dto: CreateDepartmentDto): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, dto);
  }

  // ✅ Xoá khoa (trả về message)
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DepartmentDto, CreateDepartmentDto } from '../models/department.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'https://localhost:7172/api/department';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateDepartmentDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: CreateDepartmentDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

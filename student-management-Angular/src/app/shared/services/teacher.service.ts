import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherDto, CreateTeacherDto } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = 'https://localhost:7172/api/teachers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeacherDto[]> {
    return this.http.get<TeacherDto[]>(this.apiUrl);
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

// src/app/shared/services/semester.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemesterDto, CreateSemesterDto } from '../models/semester.model';

@Injectable({ providedIn: 'root' })
export class SemesterService {
  private apiUrl = 'https://localhost:7172/api/semesters';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SemesterDto[]> {
    return this.http.get<SemesterDto[]>(this.apiUrl);
  }

  getAllSemesters(): Observable<SemesterDto[]> {
    return this.http.get<SemesterDto[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<SemesterDto> {
    return this.http.get<SemesterDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSemesterDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: CreateSemesterDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggle(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/toggle`, {});
  }
}

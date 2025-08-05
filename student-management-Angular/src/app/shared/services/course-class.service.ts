import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseClassDto, CreateCourseClassDto } from '../models/course-class.model';

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class CourseClassService {
  private apiUrl = 'https://localhost:7172/api/CourseClass';

  constructor(private http: HttpClient) {}

  getPaged(page: number = 1, pageSize: number = 20): Observable<PaginatedResult<CourseClassDto>> {
    const params = new HttpParams().set('Page', page).set('PageSize', pageSize);
    return this.http.get<PaginatedResult<CourseClassDto>>(`${this.apiUrl}/paged`, { params });
  }

  getById(id: number): Observable<CourseClassDto> {
    return this.http.get<CourseClassDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateCourseClassDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: CreateCourseClassDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

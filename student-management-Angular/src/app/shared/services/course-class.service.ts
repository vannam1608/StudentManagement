import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseClassDto, CreateCourseClassDto } from '../models/course-class.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseClassService {
  private apiUrl = 'https://localhost:7172/api/CourseClass';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CourseClassDto[]> {
    return this.http.get<CourseClassDto[]>(this.apiUrl);
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

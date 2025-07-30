import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentDto, CreateEnrollmentDto } from '../models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private apiUrl = 'https://localhost:7172/api/enrollments';

  constructor(private http: HttpClient) {}

  getAllEnrollments(): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(this.apiUrl);
  }

  getEnrollmentsByStudent(studentId: number): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(`${this.apiUrl}/students/${studentId}/enrollments`);
  }

  createEnrollment(payload: CreateEnrollmentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }
}

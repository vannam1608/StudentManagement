import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectDto, CreateSubjectDto } from '../models/subject.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private apiUrl = 'https://localhost:7172/api/subjects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<SubjectDto> {
    return this.http.get<SubjectDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSubjectDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, data: any): Observable<any> {
  return this.http.put(`https://localhost:7172/api/subjects/${id}`, data, {
    responseType: 'text' as 'json' 
  });
}


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getAvailableSubjects(semesterId: number) {
  return this.http.get<SubjectDto[]>(`${this.apiUrl}/available?semesterId=${semesterId}`);
}

}

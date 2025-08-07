import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EducationProgramDto, CreateEducationProgramDto } from '../models/education-program.model';

@Injectable({ providedIn: 'root' })
export class EducationProgramService {
  private apiUrl = 'https://localhost:7172/api/programs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EducationProgramDto[]> {
    return this.http.get<EducationProgramDto[]>(this.apiUrl);
  }

  create(data: CreateEducationProgramDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  delete(id: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
}

}

// src/app/shared/services/score.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreDto, InputScoreDto } from '../models/score.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://localhost:7172/api/score';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiUrl}/all`);
  }

  inputScore(dto: InputScoreDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/input`, dto);
  }

  getByStudent(studentId: number): Observable<ScoreDto[]> {
  return this.http.get<ScoreDto[]>(`${this.apiUrl}/by-student/${studentId}`);
}

createMissingScores(): Observable<number> {
  return this.http.post<number>(`${this.apiUrl}/auto-create`, {});
}

getMyScores(): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiUrl}/my`);
  }

  /** Lấy điểm theo từng môn học (gộp hoặc group by subject) */
  getScoresBySubject(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-by-subject`);
  }
}

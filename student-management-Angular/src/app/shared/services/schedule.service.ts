import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private apiUrl = 'https://localhost:7172/api/student/schedule';

  constructor(private http: HttpClient) {}

  getStudentSchedule(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

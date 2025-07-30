import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationDto, CreateNotificationDto } from '../models/notification.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'https://localhost:7172/api/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<NotificationDto> {
    return this.http.get<NotificationDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateNotificationDto): Observable<any> {
  return this.http.post(this.apiUrl, dto, { responseType: 'text' as 'json' });
}

update(id: number, dto: CreateNotificationDto): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, dto, { responseType: 'text' as 'json' });
}


}

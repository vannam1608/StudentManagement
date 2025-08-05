import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDto, CreateNotificationDto } from '../models/notification.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'https://localhost:7172/api/notifications';

  constructor(private http: HttpClient) {}

  getPaged(page: number, pageSize: number): Observable<PagedResult<NotificationDto>> {
    const params = new HttpParams()
      .set('Page', page.toString())
      .set('PageSize', pageSize.toString());

    return this.http.get<PagedResult<NotificationDto>>(this.apiUrl, { params });
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

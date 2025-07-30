import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, CreateUserDto, UpdateUserDto, UserCredentialDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:7172/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  create(user: CreateUserDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, user);
  }

  update(id: number, user: UpdateUserDto): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { responseType: 'text' });
  }

  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}



  getCredentials(): Observable<UserCredentialDto[]> {
    return this.http.get<UserCredentialDto[]>(`${this.apiUrl}/credentials`);
  }

  changePassword(id: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, JSON.stringify(newPassword), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  changeRole(id: number, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/role`, JSON.stringify(newRole), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

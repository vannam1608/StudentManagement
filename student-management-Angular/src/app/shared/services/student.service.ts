import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentDto, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'https://localhost:7172/api/users/students'; // Cho Admin
  private selfApiUrl = 'https://localhost:7172/api/student';     // Cho Student

  constructor(private http: HttpClient) {}

  // ✅ Admin: lấy tất cả sinh viên
  getAll(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(this.apiUrl);
  }

  // ✅ Nếu component khác gọi getAllStudents() thì cần method này:
  getAllStudents(): Observable<StudentDto[]> {
    return this.getAll(); // hoặc gọi lại trực tiếp apiUrl nếu muốn
  }

  getById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateStudentDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateStudentDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
  return this.http.delete(`https://localhost:7172/api/users/${id}`);
}


  // ✅ Student: lấy thông tin chính mình
  getProfile(): Observable<StudentDto> {
  return this.http.get<StudentDto>('https://localhost:7172/api/student/me');
}

updateProfile(dto: UpdateStudentDto): Observable<any> {
  return this.http.put('https://localhost:7172/api/student/me', dto);
  
}

}

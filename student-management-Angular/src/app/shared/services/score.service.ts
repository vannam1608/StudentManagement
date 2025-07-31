import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoreDto, InputScoreDto } from '../models/score.model';
import { PagedResult } from '../models/paged-result.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://localhost:7172/api/score';

  constructor(private http: HttpClient) {}

  /** 🔄 Lấy tất cả điểm (chỉ dùng cho admin với ít dữ liệu) 
  getAll(): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiUrl}/all`);
  }*/
getTotalCountFromPaged(): Observable<number> {
  return this.getPagedScores(1, 1).pipe(
    map(res => res.totalItems)
  );
}
  /** ✅ Lấy điểm có phân trang, kèm lọc theo mã sinh viên và lớp */
  getPagedScores(
    page: number,
    pageSize: number,
    studentCode: string = '',
    classCode: string = ''
  ): Observable<PagedResult<ScoreDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (studentCode.trim()) params = params.set('studentCode', studentCode.trim());
    if (classCode.trim()) params = params.set('classCode', classCode.trim());

    return this.http.get<PagedResult<ScoreDto>>(`${this.apiUrl}/paged`, { params });
  }

  /** ✏️ Nhập hoặc cập nhật điểm */
  inputScore(dto: InputScoreDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/input`, dto);
  }

  /** 📚 Lấy điểm theo ID sinh viên (admin xem) */
  getByStudent(studentId: number): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiUrl}/by-student/${studentId}`);
  }

  /** ⚙️ Tự động tạo các bản ghi điểm còn thiếu */
  createMissingScores(): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/auto-create`, {});
  }

  /** 👨‍🎓 Sinh viên đăng nhập lấy toàn bộ điểm của mình */
  getMyScores(): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiUrl}/my`);
  }

  /** 📊 Lấy điểm nhóm theo môn học (dành cho sinh viên) */
  getScoresBySubject(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-by-subject`);
  }
}

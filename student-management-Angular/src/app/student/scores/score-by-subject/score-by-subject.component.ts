import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-score-by-subject',
  standalone: true,
  templateUrl: './score-by-subject.component.html',
  styleUrl: './score-by-subject.component.scss',
  imports: [CommonModule, FormsModule]
})
export class ScoreBySubjectComponent implements OnInit {
  subjects: any[] = [];
  subjectId: number | null = null;
  scores: any[] = []; // luôn là mảng để *ngFor sử dụng

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🌀 ScoreBySubjectComponent khởi tạo');
    this.loadSubjects();
  }

  // Lấy danh sách môn học mà sinh viên đã đăng ký
  loadSubjects() {
    this.http.get<any[]>('/api/student/my-subjects').subscribe({
      next: data => {
        console.log('📘 Danh sách môn học:', data);
        this.subjects = data;
      },
      error: err => {
        console.error('❌ Không tải được danh sách môn học:', err);
      }
    });
  }

  // Gọi API tra điểm theo subjectId
  search() {
    if (!this.subjectId) return;

    this.http.get<any>(`/api/Score/my/subject/${this.subjectId}`).subscribe({
      next: data => {
        this.scores = [data]; // bọc object thành mảng để *ngFor hoạt động
        console.log('✅ Điểm nhận được:', this.scores);
      },
      error: err => {
        console.error('❌ Lỗi khi lấy điểm:', err);
        this.scores = []; // clear dữ liệu nếu lỗi
      }
    });
  }
}

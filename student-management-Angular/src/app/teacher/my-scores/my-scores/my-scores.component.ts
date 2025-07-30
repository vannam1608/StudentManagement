import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-scores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-scores.component.html',
  styleUrls: ['./my-scores.component.scss']
})
export class MyScoresComponent implements OnInit {
  scores: any[] = [];
  filteredScores: any[] = [];
  availableClasses: string[] = [];
  selectedClassCode: string = '';
  editingScore: any = null;
  loading = true;
  error = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchScores();
  }

  fetchScores(): void {
    this.loading = true;
    this.http.get<any[]>(`api/score/my-class`).subscribe({
      next: data => {
        this.scores = data;
        this.filteredScores = data;

        // Lấy danh sách classCode duy nhất
        this.availableClasses = Array.from(new Set(data.map(s => s.classCode)));

        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi khi tải điểm:', err);
        this.error = 'Không thể tải dữ liệu điểm.';
        this.loading = false;
      }
    });
  }

  applyClassFilter(): void {
    this.filteredScores = this.selectedClassCode
      ? this.scores.filter(s => s.classCode === this.selectedClassCode)
      : this.scores;
  }

  startEdit(score: any) {
    this.editingScore = { ...score }; // tạo bản sao
  }

  cancelEdit() {
    this.editingScore = null;
  }

  saveScore() {
    if (!this.editingScore) return;

    const payload = {
      enrollmentId: this.editingScore.enrollmentId,
      midterm: this.editingScore.midterm,
      final: this.editingScore.final,
      other: this.editingScore.other
    };

    this.http.post(`api/score/input`, payload).subscribe({
      next: () => {
        this.editingScore = null;
        this.fetchScores(); // Gọi lại toàn bộ dữ liệu để cập nhật chính xác
      },
      error: err => {
        console.error('❌ Lỗi khi cập nhật điểm:', err);
        alert('Không thể cập nhật điểm.');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-my-score-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-score-list.component.html',
  styleUrls: ['./my-score-list.component.scss']
})
export class MyScoreListComponent implements OnInit {
  semesterScores: {
    semesterName: string;
    scores: ScoreDto[];
  }[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const studentId = this.authService.getUserId();

    if (!studentId) {
      console.error('❌ Không tìm thấy studentId từ token!');
      return;
    }

    this.http.get<any[]>(`https://localhost:7172/api/Score/grouped-by-semester/${studentId}`)
      .subscribe({
        next: data => {
          this.semesterScores = data.map(semester => {
            semester.scores = semester.scores.map((score: ScoreDto) => {
              const hasAll = score.midterm != null && score.final != null && score.other != null;
              score.status = hasAll
                ? (score.total >= 4 ? '✅ Đậu' : '❌ Rớt')
                : '⏳ Chưa có điểm';
              return score;
            });
            return semester;
          });
        },
        error: err => console.error('❌ Lỗi lấy dữ liệu điểm:', err)
      });
  }

// Hàm quy đổi từ hệ 10 sang hệ 4.0
convertToGPA(score10: number): number {
  if (score10 >= 8.5) return 4.0;
  if (score10 >= 7.0) return 3.0;
  if (score10 >= 5.5) return 2.0;
  if (score10 >= 4.0) return 1.0;
  return 0.0;
}

// GPA học kỳ (trả về cả hệ 10 và 4.0)
getSemesterGPA(semesterName: string): { gpa10: string, gpa4: string } {
  const semester = this.semesterScores.find(s => s.semesterName === semesterName);
  if (!semester) return { gpa10: '-', gpa4: '-' };

  const validScores = semester.scores.filter(s => s.total != null);
  if (validScores.length === 0) return { gpa10: '-', gpa4: '-' };

  const sum10 = validScores.reduce((acc, s) => acc + s.total, 0);
  const avg10 = sum10 / validScores.length;

  const sum4 = validScores.reduce((acc, s) => acc + this.convertToGPA(s.total), 0);
  const avg4 = sum4 / validScores.length;

  return {
    gpa10: avg10.toFixed(2),
    gpa4: avg4.toFixed(2)
  };
}

// GPA toàn khóa (trả về cả hệ 10 và 4.0)
getOverallGPA(): { gpa10: string, gpa4: string } {
  const allScores = this.semesterScores.flatMap(s => s.scores).filter(s => s.total != null);
  if (allScores.length === 0) return { gpa10: '-', gpa4: '-' };

  const sum10 = allScores.reduce((acc, s) => acc + s.total, 0);
  const avg10 = sum10 / allScores.length;

  const sum4 = allScores.reduce((acc, s) => acc + this.convertToGPA(s.total), 0);
  const avg4 = sum4 / allScores.length;

  return {
    gpa10: avg10.toFixed(2),
    gpa4: avg4.toFixed(2)
  };
}


}

interface ScoreDto {
  id: number;
  enrollmentId: number;
  studentCode: string;
  fullName: string;
  midterm?: number;
  final?: number;
  other?: number;
  total: number;
  subjectName: string;
  classCode: string;
  status?: string;
}

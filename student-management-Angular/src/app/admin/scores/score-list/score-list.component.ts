import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../../shared/services/score.service';
import { ScoreDto, InputScoreDto } from '../../../shared/models/score.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-list.component.html'
})
export class ScoreListComponent implements OnInit {
  scores: ScoreDto[] = [];
  groupedScores: { [semester: string]: ScoreDto[] } = {};
  editing: { [id: number]: boolean } = {};
  successMessage = '';
  errorMessage = '';
  studentCode: string = ''; // dùng để lọc theo mã SV

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  loadScores(): void {
    this.scoreService.getAll().subscribe({
      next: data => {
        this.scores = data;
        this.groupedScores = this.groupBySemester(data);
      },
      error: err => {
        this.errorMessage = 'Lỗi tải điểm';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  groupBySemester(scores: ScoreDto[]): { [semester: string]: ScoreDto[] } {
    const grouped: { [key: string]: ScoreDto[] } = {};
    for (const s of scores) {
      const key = s.semesterName || 'Chưa rõ học kỳ';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    }
    return grouped;
  }

  edit(score: ScoreDto) {
    this.editing[score.id] = true;
  }

  save(score: ScoreDto) {
    const dto: InputScoreDto = {
      enrollmentId: score.enrollmentId,
      midterm: score.midterm,
      final: score.final,
      other: score.other
    };
    this.scoreService.inputScore(dto).subscribe({
      next: () => {
        this.successMessage = '✅ Cập nhật điểm thành công';
        this.editing[score.id] = false;
        setTimeout(() => this.successMessage = '', 3000);
        this.loadScores();
      },
      error: err => {
        this.errorMessage = '❌ Cập nhật thất bại';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  cancel(id: number) {
    this.editing[id] = false;
    this.loadScores();
  }

  // 🎓 Lọc điểm theo mã sinh viên
  filterByStudent(): void {
    const trimmedCode = this.studentCode.trim().toLowerCase();
    if (!trimmedCode) {
      this.resetFilter();
      return;
    }
    const filtered = this.scores.filter(s =>
      s.studentCode.toLowerCase().includes(trimmedCode)
    );
    this.groupedScores = this.groupBySemester(filtered);
  }

  // 🔄 Reset bộ lọc
  resetFilter(): void {
    this.groupedScores = this.groupBySemester(this.scores);
  }

  // ⚙️ Tạo điểm tự động nếu còn thiếu
  autoCreateScores(): void {
    this.scoreService.createMissingScores().subscribe({
      next: count => {
        this.successMessage = `✅ Đã tạo ${count} điểm mới`;
        this.loadScores();
      },
      error: err => {
        this.errorMessage = '❌ Tạo điểm tự động thất bại';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}

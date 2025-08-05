import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../../shared/services/score.service';
import { ScoreDto, InputScoreDto } from '../../../shared/models/score.model';
import {    FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-list.component.html'
})
export class ScoreListComponent implements OnInit {
  scores: ScoreDto[] = [];
  editing: { [id: number]: boolean } = {};
  successMessage = '';
  errorMessage = '';

  // 🔍 Bộ lọc
  studentCode: string = '';
  classCode: string = '';

  // ✅ Phân trang
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  loadScores(): void {
  const student = this.studentCode.trim();
  const cls = this.classCode.trim();

  this.scoreService.getPagedScores(this.currentPage, this.pageSize, student, cls).subscribe({
    next: res => {
      this.scores = res.data.sort((a, b) => {
        // Sắp xếp theo mã sinh viên dạng SV001, SV002...
        const numA = parseInt(a.studentCode.replace(/\D/g, ''), 10);
        const numB = parseInt(b.studentCode.replace(/\D/g, ''), 10);

        if (numA !== numB) return numA - numB;
        // Nếu cùng SV → có thể sắp theo tên môn học
        return a.subjectName.localeCompare(b.subjectName);
      });

      this.totalCount = res.totalItems;
      this.totalPages = res.totalPages;
    },
    error: () => {
      this.errorMessage = '❌ Lỗi tải dữ liệu phân trang từ API';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  });
}



  // ✏️ Chỉnh sửa điểm
  edit(score: ScoreDto) {
    this.editing[score.id] = true;
  }

  // 💾 Lưu điểm
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
        setTimeout(() => (this.successMessage = ''), 3000);
        this.loadScores();
      },
      error: () => {
        this.errorMessage = '❌ Cập nhật thất bại';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  // ❌ Hủy chỉnh sửa
  cancel(id: number) {
    this.editing[id] = false;
    this.loadScores();
  }

  // ⚙️ Tạo điểm tự động
  autoCreateScores(): void {
    this.scoreService.createMissingScores().subscribe({
      next: count => {
        this.successMessage = `✅ Đã tạo ${count} điểm mới`;
        this.loadScores();
      },
      error: () => {
        this.errorMessage = '❌ Tạo điểm tự động thất bại';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  // 🔍 Lọc
  filterScores(): void {
    this.currentPage = 1;
    this.loadScores();
  }

  // ⏮️ Phân trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadScores();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadScores();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadScores();
    }
  }
}

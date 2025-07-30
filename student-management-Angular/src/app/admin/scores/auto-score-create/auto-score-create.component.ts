import { Component } from '@angular/core';
import { ScoreService } from '../../../shared/services/score.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auto-score-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auto-score-create.component.html'
})
export class AutoScoreCreateComponent {
  resultMessage = '';

  constructor(private scoreService: ScoreService) {}

  generate() {
    this.scoreService.createMissingScores().subscribe({
      next: count => {
        this.resultMessage = `✅ Đã tạo ${count} bản ghi điểm còn thiếu`;
        setTimeout(() => this.resultMessage = '', 3000);
      },
      error: () => {
        this.resultMessage = '❌ Không thể tạo bản ghi điểm';
        setTimeout(() => this.resultMessage = '', 3000);
      }
    });
  }
}

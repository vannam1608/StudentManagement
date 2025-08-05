import { Component } from '@angular/core';
import { InputScoreDto } from '../../../shared/models/score.model';
import { ScoreService } from '../../../shared/services/score.service';
import {  FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-score',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-score.component.html'
})
export class InputScoreComponent {
  dto: InputScoreDto = {
    enrollmentId: 0,
    midterm: 0,
    final: 0,
    other: 0
  };

  successMessage = '';
  errorMessage = '';

  constructor(private scoreService: ScoreService) {}

  submit() {
    this.scoreService.inputScore(this.dto).subscribe({
      next: () => {
        this.successMessage = '✅ Nhập điểm thành công';
        this.dto = { enrollmentId: 0, midterm: 0, final: 0, other: 0 };
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = '❌ Nhập điểm thất bại';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}

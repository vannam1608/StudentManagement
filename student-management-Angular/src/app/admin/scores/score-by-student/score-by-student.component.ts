import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../../shared/services/score.service';
import { ScoreDto } from '../../../shared/models/score.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-by-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-by-student.component.html'
})
export class ScoreByStudentComponent implements OnInit {
  studentId!: number;
  scores: ScoreDto[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.scoreService.getByStudent(this.studentId).subscribe({
        next: res => this.scores = res,
        error: err => this.errorMessage = 'Không thể tải điểm sinh viên.'
      });
    }
  }
}

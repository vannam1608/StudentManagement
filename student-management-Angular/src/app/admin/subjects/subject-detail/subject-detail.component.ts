// src/app/admin/subjects/subject-detail/subject-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../../shared/services/subject.service';
import { SubjectDto } from '../../../shared/models/subject.model';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
export class SubjectDetailComponent implements OnInit {
  subject?: SubjectDto;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subjectService.getById(id).subscribe({
        next: data => {
          this.subject = data;
          this.isLoading = false;
        },
        error: err => {
          this.error = 'Không thể tải dữ liệu môn học.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'ID không hợp lệ.';
      this.isLoading = false;
    }
  }
}

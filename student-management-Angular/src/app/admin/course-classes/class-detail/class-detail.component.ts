import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseClassService } from '../../../shared/services/course-class.service';
import { CourseClassDto } from '../../../shared/models/course-class.model';

@Component({
  selector: 'app-course-class-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './class-detail.component.html'
})
export class CourseClassDetailComponent implements OnInit {
  courseClass?: CourseClassDto;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private courseClassService: CourseClassService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadDetail(id);
    }
  }

  loadDetail(id: number): void {
    this.courseClassService.getById(id).subscribe({
      next: data => this.courseClass = data,
      error: err => this.errorMessage = 'Không thể tải thông tin lớp học phần.'
    });
  }
}

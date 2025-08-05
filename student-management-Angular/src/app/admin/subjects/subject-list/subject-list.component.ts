import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubjectService } from '../../../shared/services/subject.service';
import { SubjectDto } from '../../../shared/models/subject.model';
import { PagedResult } from '../../../shared/models/paged-result.model';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
  subjects: SubjectDto[] = [];
  totalItems = 0;
  totalPages = 0;
  page = 1;
  pageSize = 5;
  loading = false;

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.subjectService.getPagedSubjects(this.page, this.pageSize).subscribe({
      next: (res: PagedResult<SubjectDto>) => {
        this.subjects = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách môn học:', err);
        this.loading = false;
      }
    });
  }

  deleteSubject(id: number) {
    if (confirm('Bạn có chắc muốn xoá môn học này?')) {
      this.subjectService.delete(id).subscribe(() => this.loadSubjects());
    }
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadSubjects();
    }
  }
}

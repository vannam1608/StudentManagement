import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubjectDto } from '../../../shared/models/subject.model';
import { SubjectService } from '../../../shared/services/subject.service';

@Component({
  selector: 'app-subject-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subject-search.component.html',
})
export class SubjectSearchComponent implements OnInit {
  searchText: string = '';
  allSubjects: SubjectDto[] = [];
  filteredSubjects: SubjectDto[] = [];
  pagedSubjects: SubjectDto[] = [];

  currentPage = 1;
  pageSize = 10; // ✅ mặc định
  totalPages = 0;

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    // Lấy tất cả môn học (giả sử tối đa 1000)
    this.subjectService.getPagedSubjects(1, 1000).subscribe({
      next: res => {
        this.allSubjects = res.data;
        this.filteredSubjects = res.data;
        this.updatePagination();
      },
      error: err => console.error(err),
    });
  }

  search(): void {
    const text = this.searchText.toLowerCase().trim();
    this.filteredSubjects = this.allSubjects.filter(s =>
      s.id.toString().includes(text) ||
      s.subjectCode.toLowerCase().includes(text) ||
      s.name.toLowerCase().includes(text)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.totalPages = Math.ceil(this.filteredSubjects.length / this.pageSize);
    this.pagedSubjects = this.filteredSubjects.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }
}

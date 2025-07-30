import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubjectDto } from '../../../shared/models/subject.model';
import { SubjectService } from '../../../shared/services/subject.service';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
  subjects: SubjectDto[] = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAll().subscribe({
      next: data => this.subjects = data,
      error: err => console.error(err)
    });
  }

  deleteSubject(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      this.subjectService.delete(id).subscribe(() => this.loadSubjects());
    }
  }
}

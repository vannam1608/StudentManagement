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

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.subjectService.getAll().subscribe({
      next: data => {
        this.allSubjects = data;
        this.filteredSubjects = data;
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
  }
}

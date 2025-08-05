import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  RouterLink } from '@angular/router';
import { TeacherService } from '../../../shared/services/teacher.service';
import { TeacherDto } from '../../../shared/models/teacher.model';
@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './teacher-detail.component.html'
})
export class TeacherDetailComponent implements OnInit {
  teacher?: TeacherDto;

  constructor(private route: ActivatedRoute, private teacherService: TeacherService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.teacherService.getById(id).subscribe(data => this.teacher = data);
  }
}

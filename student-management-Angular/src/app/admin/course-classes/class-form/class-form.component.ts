import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseClassService } from '../../../shared/services/course-class.service';
import { SubjectService } from '../../../shared/services/subject.service';
import { TeacherService } from '../../../shared/services/teacher.service';
import { SemesterService } from '../../../shared/services/semester.service';
import { CreateCourseClassDto } from '../../../shared/models/course-class.model';
import { SubjectDto } from '../../../shared/models/subject.model';
import { TeacherDto } from '../../../shared/models/teacher.model';
import { SemesterDto } from '../../../shared/models/semester.model';
import { RouterModule } from '@angular/router';
import { PagedResult } from '../../../shared/models/paged-result.model';
@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './class-form.component.html'
})
export class ClassFormComponent implements OnInit {
  isEdit: boolean = false;
  classId?: number;
  formData: CreateCourseClassDto = {
    classCode: '',
    subjectId: 0,
    teacherId: 0,
    semesterId: 0,
    schedule: '',
    maxStudents: undefined
  };

  subjects: SubjectDto[] = [];
  teachers: TeacherDto[] = [];
  semesters: SemesterDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseClassService: CourseClassService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.classId = idParam ? +idParam : undefined;
    this.isEdit = !!this.classId;

    if (this.isEdit) {
      this.courseClassService.getById(this.classId!).subscribe({
        next: data => {
          this.formData = {
            classCode: data.classCode,
            subjectId: data.subjectId,
            teacherId: data.teacherId,
            semesterId: data.semesterId,
            schedule: data.schedule,
            maxStudents: data.maxStudents
          };
        },
        error: () => alert('❌ Không tìm thấy lớp học phần!')
      });
    }
  }

 loadOptions() {
  this.subjectService.getPagedSubjects(1, 1000).subscribe((res: PagedResult<SubjectDto>) => {
    this.subjects = res.data;
  });

  this.teacherService.getPagedTeachers(1, 1000).subscribe((res: PagedResult<TeacherDto>) => {
    this.teachers = res.data;
  });

  this.semesterService.getAll().subscribe((data: SemesterDto[]) => {
    this.semesters = data;
  });
}


  submitForm() {
    if (!this.formData.classCode || !this.formData.subjectId || !this.formData.teacherId || !this.formData.semesterId) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (this.isEdit) {
      this.courseClassService.update(this.classId!, this.formData).subscribe({
        next: () => {
          alert('✅ Cập nhật lớp học phần thành công!');
          this.router.navigate(['/admin/course-classes']);
        },
        error: () => alert('❌ Cập nhật thất bại!')
      });
    } else {
      this.courseClassService.create(this.formData).subscribe({
        next: () => {
          alert('✅ Tạo lớp học phần thành công!');
          this.router.navigate(['/admin/course-classes']);
        },
        error: () => alert('❌ Tạo thất bại!')
      });
    }
  }
}

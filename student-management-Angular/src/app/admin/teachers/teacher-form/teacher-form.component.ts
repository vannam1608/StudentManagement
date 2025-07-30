import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeacherService } from '../../../shared/services/teacher.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreateTeacherDto,TeacherDto } from '../../../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './teacher-form.component.html'
})
export class TeacherFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  teacherId?: number;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacherId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.teacherId;

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', this.isEdit ? [] : Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      teacherCode: ['', Validators.required],
      degree: ['', Validators.required]
    });

    if (this.isEdit) {
      this.teacherService.getById(this.teacherId).subscribe((data: TeacherDto) => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit() {
  if (this.form.invalid) return;

  const value = this.form.value;

  if (this.isEdit) {
    this.teacherService.update(this.teacherId!, value).subscribe({
      next: () => {
        alert('✅ Cập nhật giảng viên thành công');
        this.router.navigate(['/admin/teachers']);
      },
      error: err => {
        console.error(err);
        alert('❌ Cập nhật thất bại');
      }
    });
  } else {
    this.teacherService.create(value).subscribe({
      next: () => {
        alert('✅ Thêm giảng viên thành công');
        this.router.navigate(['/admin/teachers']);
      },
      error: err => {
        console.error(err);
        alert('❌ Tạo giảng viên thất bại. Vui lòng kiểm tra dữ liệu');
      }
    });
  }
}

}

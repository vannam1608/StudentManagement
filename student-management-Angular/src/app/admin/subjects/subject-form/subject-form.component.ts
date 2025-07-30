import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../shared/services/subject.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  subjectId?: number;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.subjectId;

    this.form = this.fb.group({
      subjectCode: ['', Validators.required],
      name: ['', Validators.required],
      credit: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    if (this.isEdit) {
      this.subjectService.getById(this.subjectId!).subscribe({
        next: data => this.form.patchValue(data),
        error: err => this.errorMessage = '❌ Lỗi tải môn học.'
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.isEdit) {
      this.subjectService.update(this.subjectId!, this.form.value).subscribe({
        next: () => {
          this.successMessage = '✅ Cập nhật môn học thành công!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/admin/subjects']), 1500);
        },
        error: err => {
          this.errorMessage = '❌ Lỗi cập nhật: ' + (err.error?.message || err.message || 'Không xác định');
        }
      });
    } else {
      this.subjectService.create(this.form.value).subscribe({
        next: () => {
          this.successMessage = '✅ Thêm môn học thành công!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/admin/subjects']), 1500);
        },
        error: err => {
          this.errorMessage = '❌ Lỗi thêm môn học: ' + (err.error?.message || err.message || 'Không xác định');
        }
      });
    }
  }
}

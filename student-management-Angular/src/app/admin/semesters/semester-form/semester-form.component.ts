// src/app/admin/semesters/semester-form/semester-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router,  RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SemesterService } from '../../../shared/services/semester.service';
import { SemesterDto, CreateSemesterDto } from '../../../shared/models/semester.model';

@Component({
  selector: 'app-semester-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './semester-form.component.html',
})
export class SemesterFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  semesterId?: number;

  constructor(
    private fb: FormBuilder,
    private semesterService: SemesterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.semesterId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.semesterId;

    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isOpen: [false] // ✅ Checkbox mở học kỳ
    });

    if (this.isEdit) {
      this.semesterService.getById(this.semesterId!).subscribe(semester => {
        this.form.patchValue(semester);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const dto: CreateSemesterDto = this.form.value;

    if (this.isEdit) {
      this.semesterService.update(this.semesterId!, dto).subscribe(() => {
        this.router.navigate(['/admin/semesters']);
      });
    } else {
      this.semesterService.create(dto).subscribe(() => {
        this.router.navigate(['/admin/semesters']);
      });
    }
  }
}

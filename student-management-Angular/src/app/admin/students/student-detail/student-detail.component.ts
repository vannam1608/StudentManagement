import { Component, inject } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto } from '../../../shared/models/student.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private router = inject(Router); // ⬅ Inject router

  student: StudentDto | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.errorMessage = 'ID không hợp lệ.';
      return;
    }

    this.studentService.getById(id).subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (err) => {
        console.error('❌ Lỗi khi lấy sinh viên:', err);
        this.errorMessage = 'Không tìm thấy thông tin sinh viên.';
      }
    });
  }

  editStudent() {
    if (this.student?.id)
      this.router.navigate(['/admin/students/edit', this.student.id]);
  }

  goBack() {
    this.router.navigate(['/admin/students']);
  }
}

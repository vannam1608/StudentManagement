import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EducationProgramService } from '../../../shared/services/education-program.service';
import { EducationProgramDto, CreateEducationProgramDto } from '../../../shared/models/education-program.model';

@Component({
  selector: 'app-education-program',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './education-program.component.html'
})
export class EducationProgramComponent implements OnInit {
  programs: EducationProgramDto[] = [];
  newProgramName: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private programService: EducationProgramService) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms() {
    this.programService.getAll().subscribe({
      next: (data) => this.programs = data,
      error: () => this.errorMessage = 'Không thể tải danh sách chương trình đào tạo.'
    });
  }

  createProgram() {
    if (!this.newProgramName.trim()) {
      this.errorMessage = 'Tên chương trình không được để trống.';
      return;
    }

    const dto: CreateEducationProgramDto = { name: this.newProgramName };
    this.programService.create(dto).subscribe({
      next: () => {
        this.successMessage = '✅ Tạo thành công!';
        this.errorMessage = '';
        this.newProgramName = '';
        this.loadPrograms();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = '❌ Tạo thất bại.';
        this.successMessage = '';
      }
    });
  }

  deleteProgram(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa chương trình này?')) {
      this.programService.delete(id).subscribe({
        next: () => {
          this.successMessage = '✅ Xóa thành công!';
          this.loadPrograms();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => this.errorMessage = '❌ Xóa thất bại.'
      });
    }
  }
}

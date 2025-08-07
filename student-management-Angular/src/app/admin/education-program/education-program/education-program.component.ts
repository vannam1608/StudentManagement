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
      next: (data) => {
        this.programs = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('❌ Load Error:', err);
        this.errorMessage = 'Không thể tải danh sách chương trình đào tạo.';
      }
    });
  }

  createProgram() {
    this.clearMessages();

    if (!this.newProgramName.trim()) {
      this.errorMessage = 'Tên chương trình không được để trống.';
      return;
    }

    const dto: CreateEducationProgramDto = { name: this.newProgramName };

    this.programService.create(dto).subscribe({
      next: (res) => {
        console.log('✅ Create Response:', res);
        this.successMessage = res.message || '✅ Tạo thành công!';
        this.newProgramName = '';
        this.loadPrograms();
        this.clearSuccessMessageAfterDelay();
      },
      error: (err) => {
        console.error('❌ Create Error:', err);
        this.errorMessage = err.error?.message || '❌ Tạo thất bại.';
      }
    });
  }

  deleteProgram(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa chương trình này?')) return;

    this.clearMessages();

    this.programService.delete(id).subscribe({
      next: (res) => {
        console.log('✅ Delete Response:', res);
        this.successMessage = res.message || '✅ Xóa thành công!';
        this.loadPrograms();
        this.clearSuccessMessageAfterDelay();
      },
      error: (err) => {
        console.error('❌ Delete Error:', err);
        this.errorMessage = err.error?.message || '❌ Xóa thất bại.';
      }
    });
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private clearSuccessMessageAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}

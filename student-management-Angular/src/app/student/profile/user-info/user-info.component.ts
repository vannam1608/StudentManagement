import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { StudentService } from '../../../shared/services/student.service';
import { StudentDto } from '../../../shared/models/student.model';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  student?: StudentDto;
  loading = true;

  constructor(
    private studentService: StudentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const nav = this.location.getState() as any;

    if (nav?.updated) {
      alert('🎉 Cập nhật thông tin thành công!');
    }

    this.loadStudentInfo();
  }

  // ✅ Load student information
  loadStudentInfo(): void {
    this.loading = true;
    this.studentService.getProfile().subscribe({
      next: (data) => {
        this.student = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin sinh viên', err);
        this.loading = false;
      }
    });
  }

  // ✅ Get join date (enrollment date)
  getJoinDate(): string {
    // Assuming student has an enrollment date, otherwise use a default
    return new Date(2020, 8, 1).getFullYear().toString(); // September 2020
  }

  // ✅ Export profile to PDF
  exportProfile(): void {
    // Implementation for PDF export
    console.log('Exporting profile to PDF...');
    // You can implement PDF generation here
    alert('Tính năng xuất PDF sẽ được cập nhật sớm!');
  }

  // ✅ Get gender badge class
  getGenderBadgeClass(gender: string): string {
    switch (gender?.toLowerCase()) {
      case 'nam':
      case 'male':
        return 'bg-primary-soft text-primary';
      case 'nữ':
      case 'female':
        return 'bg-pink-soft text-pink';
      default:
        return 'bg-secondary-soft text-secondary';
    }
  }

  // ✅ Get gender icon
  getGenderIcon(gender: string): string {
    switch (gender?.toLowerCase()) {
      case 'nam':
      case 'male':
        return 'bi-gender-male';
      case 'nữ':
      case 'female':
        return 'bi-gender-female';
      default:
        return 'bi-gender-ambiguous';
    }
  }

  // ✅ Get gender text
  getGenderText(gender: string): string {
    switch (gender?.toLowerCase()) {
      case 'nam':
      case 'male':
        return 'Nam';
      case 'nữ':
      case 'female':
        return 'Nữ';
      default:
        return 'Chưa xác định';
    }
  }

  // ✅ Calculate age from date of birth
  getAge(): number {
    if (!this.student?.dateOfBirth) return 0;
    
    const birthDate = new Date(this.student.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // ✅ Get current academic year
  getCurrentAcademicYear(): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Academic year typically starts in September
    if (currentMonth >= 9) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  }
}

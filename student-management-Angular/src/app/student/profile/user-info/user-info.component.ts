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
}

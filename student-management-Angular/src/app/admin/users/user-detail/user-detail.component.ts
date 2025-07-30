import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserDto } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  user?: UserDto;
  normalizedRole = '';
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.errorMessage = 'ID người dùng không hợp lệ.';
      this.loading = false;
      return;
    }

    this.userService.getById(id).subscribe({
      next: user => {
        this.user = user;
        this.normalizedRole = user.role.toLowerCase(); // 👈 xử lý ở đây
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Không tìm thấy người dùng hoặc có lỗi xảy ra.';
        this.loading = false;
      }
    });
  }
}


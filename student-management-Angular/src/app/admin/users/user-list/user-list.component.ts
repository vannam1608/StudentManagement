import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserDto } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
  this.userService.getAllUsers().subscribe({
    next: data => {
      this.users = data.map(u => ({
        ...u,
        role: u.role.toLowerCase()  // ✅ Chuyển về chữ thường
      }));
      this.loading = false;
    },
    error: err => {
      console.error('Failed to load users', err);
      this.loading = false;
    }
  });
}


  deleteUser(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: err => {
          console.error('Xóa người dùng thất bại', err);
          alert('Không thể xóa người dùng.');
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserDto } from '../../../shared/models/user.model';
import { PagedResult } from '../../../shared/models/paged-result.model'; // ✅

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

  // ✅ Phân trang
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getPagedUsers(this.currentPage, this.pageSize).subscribe({
      next: (res: PagedResult<UserDto>) => {
        this.users = res.data.map(u => ({
          ...u,
          role: u.role.toLowerCase()
        }));
        this.totalCount = res.totalItems;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  deleteUser(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: err => {
          console.error('Xóa người dùng thất bại', err);
          alert('Không thể xóa người dùng.');
        }
      });
    }
  }
}

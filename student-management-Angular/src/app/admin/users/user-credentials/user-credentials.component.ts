import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { UserCredentialDto } from '../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-credentials.component.html'
})

export class UserCredentialsComponent implements OnInit {
  users: UserCredentialDto[] = [];

  passwordInputs: { [key: number]: string } = {};
  roleInputs: { [key: number]: string } = {};

  // ✅ Phân trang
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;

  constructor(private userService: UserService, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getPagedCredentials(this.currentPage, this.pageSize).subscribe(res => {
      this.users = res.data;
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
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

  updatePassword(id: number) {
    const newPassword = this.passwordInputs[id];
    if (!newPassword) return;

    this.userService.changePassword(id, newPassword).subscribe(() => {
      alert('Đổi mật khẩu thành công');
      this.passwordInputs[id] = '';
    });
  }

  updateRole(id: number) {
    const newRole = this.roleInputs[id];
    if (!newRole) return;

    this.userService.changeRole(id, newRole).subscribe(() => {
      alert('Cập nhật quyền thành công');
      this.roleInputs[id] = '';
      this.loadUsers(); // Refresh
    });
  }
}

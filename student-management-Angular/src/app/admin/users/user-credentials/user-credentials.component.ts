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

  // Sử dụng object để lưu từng giá trị theo userId
  passwordInputs: { [key: number]: string } = {};
  roleInputs: { [key: number]: string } = {};

  constructor(private userService: UserService, private location: Location) {}
  goBack(): void {
  this.location.back();
}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getCredentials().subscribe(data => {
      this.users = data;
    });
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
      this.loadUsers(); // refresh lại danh sách
    });
  }
  
}

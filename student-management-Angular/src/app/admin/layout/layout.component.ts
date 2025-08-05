import { Component, HostListener } from '@angular/core';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink,  RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isSidebarVisible = true;
  isMobile = false;

  menuItems = [
    { link: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
    { link: '/admin/users', icon: 'bi-person-lines-fill', label: 'Quản lý User' },
    { link: '/admin/students', icon: 'bi-people-fill', label: 'Sinh viên' },
    { link: '/admin/teachers', icon: 'bi-person-badge', label: 'Giảng viên' },
    { link: '/admin/subjects', icon: 'bi-journal-bookmark-fill', label: 'Môn học' },
    { link: '/admin/course-classes', icon: 'bi-easel-fill', label: 'Lớp học phần' },
    { link: '/admin/scores', icon: 'bi-bar-chart-line-fill', label: 'Điểm' },
    { link: '/admin/notifications', icon: 'bi-bell-fill', label: 'Thông báo' },
    { link: '/admin/semesters', icon: 'bi-calendar-range-fill', label: 'Học kỳ' },
    { link: '/admin/programs', icon: 'bi-diagram-3-fill', label: 'CT Đào tạo' },
    { link: '/admin/departments', icon: 'bi-building', label: 'Khoa' },
    { link: '/admin/enrollments', icon: 'bi-file-earmark-check-fill', label: 'Đăng ký học phần' }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.checkScreenSize();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isSidebarVisible = !this.isMobile;
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  fullName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fullName = localStorage.getItem('fullName') || 'Sinh viên';
  }

  logout() {
    this.authService.logout();
  }
}

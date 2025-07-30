import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';           
import { RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent {}

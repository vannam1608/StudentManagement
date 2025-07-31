import { Routes } from '@angular/router';
import { adminRoutes } from './admin/admin.routes';
import { adminGuard } from './shared/guards/admin.guard';
import { teacherGuard } from './shared/guards/teacher.guard';
import { studentGuard } from './shared/guards/student.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard], // ✅ Giới hạn quyền Admin
    children: adminRoutes,
  },
  {
    path: 'teacher',
    canActivate: [teacherGuard], // ✅ Giới hạn quyền Teacher
    loadChildren: () =>
      import('./teacher/teacher.routes').then(m => m.teacherRoutes),
  },
  {
    path: 'student',
    canActivate: [studentGuard], // ✅ Giới hạn quyền Student
    loadChildren: () =>
      import('./student/student.routes').then(m => m.studentRoutes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';

export const teacherRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },

      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/teacher-profile/teacher-profile.component').then(
            m => m.TeacherProfileComponent
          )
      },
      {
        path: 'update',
        loadComponent: () =>
          import('./profile/teacher-update/teacher-update.component').then(
            m => m.TeacherUpdateComponent
          )
      },
      {
        path: 'my-classes',
        loadComponent: () =>
          import('./my-classes/my-classes/my-classes.component').then(
            m => m.MyClassesComponent
          )
      },
      {
        path: 'my-scores',
        loadComponent: () =>
          import('./my-scores/my-scores/my-scores.component').then(
            m => m.MyScoresComponent
          )
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./change-pass/change-pass/change-pass.component').then(
            m => m.ChangePassComponent
          )
      }
    ]
  }
];


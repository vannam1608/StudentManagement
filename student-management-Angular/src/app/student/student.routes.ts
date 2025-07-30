import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { SubjectRegisterComponent } from './subject-register/subject-register/subject-register.component';
import { ScheduleComponent } from './schedule/schedule/schedule.component';
import { MyScoreListComponent } from './scores/my-score-list/my-score-list.component';
import { UserInfoComponent } from './profile/user-info/user-info.component';
import { NotificationFormComponent } from '../admin/notifications/notification-form/notification-form.component';

export const studentRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'profile-edit', component: ProfileEditComponent },
      { path: 'subjects', component: SubjectRegisterComponent },
      { path: 'schedule', component: ScheduleComponent },
      {
        path: 'scores',
        loadComponent: () => import('./scores/my-score-list/my-score-list.component').then(m => m.MyScoreListComponent)
      },
      {
        path: 'my-scores',
        loadComponent: () => import('./scores/my-score-list/my-score-list.component').then(m => m.MyScoreListComponent)
      },
      {
        path: 'score-by-subject',
        loadComponent: () => import('./scores/score-by-subject/score-by-subject.component').then(m => m.ScoreBySubjectComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notifications/notifications/notifications.component').then(m => m.NotificationsComponent)
      }
    ]
  }
];

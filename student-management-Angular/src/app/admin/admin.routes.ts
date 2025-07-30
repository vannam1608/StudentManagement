import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },

      // USERS
      {
        path: 'users',
        children: [
          {
            path: 'credentials',
            loadComponent: () =>
              import('./users/user-credentials/user-credentials.component').then(m => m.UserCredentialsComponent)
          },
          {
            path: '',
            loadComponent: () =>
              import('./users/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./users/user-detail/user-detail.component').then(m => m.UserDetailComponent)
          }
        ]
      },

      // STUDENTS
      {
        path: 'students',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./students/student-list/student-list.component').then(m => m.StudentListComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./students/student-form/student-form.component').then(m => m.StudentFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./students/student-form/student-form.component').then(m => m.StudentFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./students/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
          }
        ]
      },

      // TEACHERS
      {
        path: 'teachers',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./teachers/teacher-list/teacher-list.component').then(m => m.TeacherListComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./teachers/teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./teachers/teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./teachers/teacher-detail/teacher-detail.component').then(m => m.TeacherDetailComponent)
          }
        ]
      },

      // SUBJECTS
      {
        path: 'subjects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./subjects/subject-list/subject-list.component').then(m => m.SubjectListComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./subjects/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./subjects/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
          },
          {
            path: 'search',
            loadComponent: () =>
              import('./subjects/subject-search/subject-search.component').then(m => m.SubjectSearchComponent)
          },
          {
            path: 'available',
            loadComponent: () =>
              import('./subjects/subject-available/subject-available.component').then(m => m.SubjectAvailableComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./subjects/subject-detail/subject-detail.component').then(m => m.SubjectDetailComponent)
          }
        ]
      },


      // Trong adminRoutes:
      {
        path: 'semesters',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./semesters/semester-list/semester-list.component').then(m => m.SemesterListComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./semesters/semester-form/semester-form.component').then(m => m.SemesterFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./semesters/semester-form/semester-form.component').then(m => m.SemesterFormComponent)
          }
        ]
      },


      {
  path: 'scores',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./scores/score-list/score-list.component').then(m => m.ScoreListComponent)
    },
    {
      path: 'input/:id',
      loadComponent: () =>
        import('./scores/input-score/input-score.component').then(m => m.InputScoreComponent)
    },
    {
      path: 'scores/by-student/:id',
      loadComponent: () => import('./scores/score-by-student/score-by-student.component').then(m => m.ScoreByStudentComponent)
    },
    {
      path: 'scores/input',
      loadComponent: () => import('./scores/input-score/input-score.component').then(m => m.InputScoreComponent)
    },
    {
      path: 'scores/auto-create',
      loadComponent: () => import('./scores/auto-score-create/auto-score-create.component').then(m => m.AutoScoreCreateComponent)
    }

  ]
},

{
  path: 'course-classes',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./course-classes/class-list/class-list.component').then(m => m.ClassListComponent)
    },
    {
      path: 'create',
      loadComponent: () =>
        import('./course-classes/class-form/class-form.component').then(m => m.ClassFormComponent)
    },
    {
      path: 'edit/:id',
      loadComponent: () =>
        import('./course-classes/class-form/class-form.component').then(m => m.ClassFormComponent)
    },
    {
      path: 'detail/:id',
      loadComponent: () =>
        import('./course-classes/class-detail/class-detail.component').then(m => m.CourseClassDetailComponent)
    }
  ]
},




{
  path: 'enrollments',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./enrollments/enrollment-list/enrollment-list.component').then(m => m.EnrollmentListComponent)
    },
  ]
},



{
  path: 'departments',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./department/department-list/department-list.component').then(m => m.DepartmentListComponent)
    },
    {
      path: 'create',
      loadComponent: () =>
        import('./department/department-form/department-form.component').then(m => m.DepartmentFormComponent)
    },
    {
      path: 'edit/:id',
      loadComponent: () =>
        import('./department/department-form/department-form.component').then(m => m.DepartmentFormComponent)
    }
  ]
},



{
  path: 'notifications',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./notifications/notification-list/notification-list.component').then(m => m.NotificationListComponent)
    },
    {
  path: 'notifications/create',
  loadComponent: () =>
    import('./notifications/notification-form/notification-form.component').then(m => m.NotificationFormComponent)
},

{
      path: 'edit/:id',
      loadComponent: () =>
        import('./notifications/notification-form/notification-form.component').then(m => m.NotificationFormComponent)
    }
  ]
},


{
  path: 'programs',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./education-program/education-program/education-program.component').then(m => m.EducationProgramComponent)
    }
  ]
}




      // TODO: Add routes for scores, semesters, etc.
    ]
  }
];

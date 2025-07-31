import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // ✅ dùng ChartsModule (KHÔNG dùng NgChartsModule)

import { StudentService } from '../../../shared/services/student.service';
import { TeacherService } from '../../../shared/services/teacher.service';
import { SubjectService } from '../../../shared/services/subject.service';
import { CourseClassService } from '../../../shared/services/course-class.service';
import { ScoreService } from '../../../shared/services/score.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule], // ✅ sửa lại
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  router = inject(Router);

  stats = [
    { label: 'Sinh viên', icon: 'bi-people-fill', value: 0, route: '/admin/students' },
    { label: 'Giảng viên', icon: 'bi-person-badge', value: 0, route: '/admin/teachers' },
    { label: 'Môn học', icon: 'bi-journal-bookmark-fill', value: 0, route: '/admin/subjects' },
    { label: 'Lớp học phần', icon: 'bi-easel-fill', value: 0, route: '/admin/course-classes' },
    { label: 'Điểm đã nhập', icon: 'bi-bar-chart-fill', value: 0, route: '/admin/scores' },
    { label: 'Thông báo', icon: 'bi-bell-fill', value: 0, route: '/admin/notifications' }
  ];

  pieChartLabels: string[] = ['Sinh viên', 'Giảng viên', 'Môn học'];
  pieChartData: number[] = [0, 0, 0];
  pieChartType: ChartType = 'pie';

  latestNotifications: any[] = [];

  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private subjectService = inject(SubjectService);
  private courseClassService = inject(CourseClassService);
  private scoreService = inject(ScoreService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    forkJoin({
      students: this.studentService.getAll(),
      teachers: this.teacherService.getAll(),
      subjects: this.subjectService.getAll(),
      classes: this.courseClassService.getAll(),
      scoreCount: this.scoreService.getTotalCountFromPaged(),

      notifications: this.notificationService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats[0].value = data.students.length;
        this.stats[1].value = data.teachers.length;
        this.stats[2].value = data.subjects.length;
        this.stats[3].value = data.classes.length;
        this.stats[4].value = data.scoreCount;

        this.stats[5].value = data.notifications.length;

        this.pieChartData = [
          data.students.length,
          data.teachers.length,
          data.subjects.length
        ];

        this.latestNotifications = data.notifications
          .sort((a: any, b: any) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          )
          .slice(0, 5);
      },
      error: (err) => {
        console.error('Lỗi khi load dữ liệu thống kê:', err);
      }
    });
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}

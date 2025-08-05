import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { CreateNotificationDto, NotificationDto } from '../../../shared/models/notification.model';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-form.component.html'
})
export class NotificationFormComponent implements OnInit {
  notification: CreateNotificationDto = {
    title: '',
    content: '',
    targetRole: 'All'
  };

  isEditMode: boolean = false;
  notificationId?: number;
  message: string = '';
  error: string = '';

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.notificationId;

    if (this.isEditMode && this.notificationId) {
      this.notificationService.getById(this.notificationId).subscribe({
        next: (data: NotificationDto) => {
          this.notification = {
            title: data.title,
            content: data.content,
            targetRole: data.targetRole
          };
        },
        error: () => {
          this.error = 'Không tìm thấy thông báo cần chỉnh sửa';
        }
      });
    }
  }

  onSubmit() {
  this.error = '';
  this.message = '';

  if (this.isEditMode && this.notificationId) {
    this.notificationService.update(this.notificationId, this.notification).subscribe({
      next: (res: any) => {
        this.message = res.message || '✅ Cập nhật thông báo thành công';
        this.router.navigate(['/admin/notifications']);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Lỗi khi cập nhật thông báo';
      }
    });
  } else {
    this.notificationService.create(this.notification).subscribe({
      next: (res: any) => {
        this.message = res.message || '✅ Tạo thông báo thành công';
        this.router.navigate(['/admin/notifications']);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Lỗi khi tạo thông báo';
      }
    });
  }
}

}

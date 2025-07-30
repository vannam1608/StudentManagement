export interface NotificationDto {
  id: number;
  title: string;
  content: string;
  creatorName: string;
  createdAt: Date;
  targetRole: string; // 'Admin' | 'Teacher' | 'Student' | 'All'
}

export interface CreateNotificationDto {
  title: string;
  content: string;
  targetRole: string; // mặc định là 'All'
}
